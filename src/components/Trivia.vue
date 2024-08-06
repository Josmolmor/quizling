<template>
  <div class="auth-container">
    <button v-if="!user" @click="signInWithGoogle">Log in with Google to track your attempts</button>
    <div v-if="user" class="auth-container">
      <p>Welcome, {{ user.displayName }}</p>
      <button @click="signOut">Sign out</button>
    </div>
  </div>

  <div class="trivia">
    <div v-if="!gameStarted" class="preferences-container">
      <h2>Select Your Preferences</h2>
      <!-- Dropdowns for category, difficulty, type, amount -->
      <select v-model="selectedCategory" class="form-control">
        <option value="any">Select a category</option>
        <option value="9">General Knowledge</option>
        <option value="10">Entertainment: Books</option>
        <option value="11">Entertainment: Film</option>
        <option value="12">Entertainment: Music</option>
        <option value="13">Entertainment: Musicals &amp; Theatres</option>
        <option value="14">Entertainment: Television</option>
        <option value="15">Entertainment: Video Games</option>
        <option value="16">Entertainment: Board Games</option>
        <option value="17">Science &amp; Nature</option>
        <option value="18">Science: Computers</option>
        <option value="19">Science: Mathematics</option>
        <option value="20">Mythology</option>
        <option value="21">Sports</option>
        <option value="22">Geography</option>
        <option value="23">History</option>
        <option value="24">Politics</option>
        <option value="25">Art</option>
        <option value="26">Celebrities</option>
        <option value="27">Animals</option>
        <option value="28">Vehicles</option>
        <option value="29">Entertainment: Comics</option>
        <option value="30">Science: Gadgets</option>
        <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
        <option value="32">Entertainment: Cartoon &amp; Animations</option>
      </select>
      <select v-model="selectedDifficulty" class="form-control">
        <option value="any">Select a difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <select v-model="selectedType" class="form-control">
        <option value="any">Select a type</option>
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True / False</option>
      </select>
      <select v-model="selectedAmount" class="form-control">
        <option v-for="num in questionOptions" :key="num" :value="num">{{ num }} questions</option>
      </select>
      <button @click="startGame">Start Game</button>
    </div>
    <div v-else-if="questions.length && !isFinished" class="question-container">
      <h2><span class="current-index">#{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span> {{ decodedQuestion }}</h2>
      <div class="extra-info">
        <div><span class="info-label">Category: </span><span>{{ decodedCategory }}</span></div>
        <div><span class="info-label">Difficulty: </span><span>{{ currentQuestion.difficulty }}</span></div>
      </div>
      <ul>
        <li v-for="answer in shuffledAnswers" :key="answer">
          <button
              :class="{
              'correct': isAnswerCorrect(answer),
              'incorrect': isAnswerIncorrect(answer),
              'default': !isAnswerSelected(answer) && !isAnswerCorrect(answer)
            }"
              @click="submitAnswer(answer)"
              :disabled="feedbackVisible"
          >
            {{ htmlDecode(answer) }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else-if="!isFinished">
      <h2>Loading</h2>
    </div>
    <div v-if="isFinished">
      <h2>Your score: {{ score }}/{{ questions.length }}</h2>
      <div class="button-container">
      <button @click="startNewGame">Start New Game</button>
      <button v-if="score > 0" @click="submitScore">Submit Score</button>
      </div>
    </div>
    <hr v-if="(!gameStarted || isFinished) && leaderboard.length" />
    <div class="leaderboard-container" v-if="(!gameStarted || isFinished) && leaderboard.length">
      <h2>Leaderboard</h2>
      <ul>
        <li v-for="(user, index) in leaderboard" :key="user.id" class="leaderboard-entry">
          <span v-if="user.lastUpdated">{{ formatTimestamp(user.lastUpdated.toDate()) }}</span>
          <span v-if="!user.lastUpdated && user.createdAt">{{ formatTimestamp(user.createdAt.toDate()) }}</span>
          <span>{{ user.name }}: {{ user.score }} <span v-if="index === 0">🏅</span><span v-if="index === 1">🥈</span><span v-if="index === 2">🥉</span></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchTriviaQuestions, TriviaQuestion } from '../services/trivia';
import { htmlDecode } from '../utils/htmlDecode';
import { auth, db, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut, doc, setDoc, updateDoc, getDoc } from '../services/firebase';

import { collection, getDocs, query, orderBy, limit,  } from 'firebase/firestore';
import {format} from "date-fns";

const user = ref<any | null>(null);
const questions = ref<TriviaQuestion[]>([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const isFinished = ref(false);

const selectedCategory = ref('any');
const selectedDifficulty = ref('any');
const selectedType = ref('any');
const selectedAmount = ref(5);
const selectedAnswer = ref<string | null>(null);
const correctAnswer = ref<string | null>(null);
const feedbackVisible = ref(false);
const gameStarted = ref(false);

const questionOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

// Sign in with Google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    user.value = result.user;
  } catch (error) {
    console.error('Error during Google sign-in', error);
    alert('Sign-in failed. Please try again.');
  }
};

const signOut = async () => {
  try {
    await fbSignOut(auth);
    user.value = null;
  } catch (error) {
    console.error('Error during sign-out', error);
    alert('Sign-out failed. Please try again.');
  }
};

const fetchQuestions = async () => {
  try {
    questions.value = await fetchTriviaQuestions({
      category: selectedCategory.value,
      difficulty: selectedDifficulty.value,
      type: selectedType.value,
      amount: selectedAmount.value,
    });
    currentQuestionIndex.value = 0;
    score.value = 0;
    isFinished.value = false;
    feedbackVisible.value = false;
    selectedAnswer.value = null;
    correctAnswer.value = null;
  } catch (error) {
    console.error('Failed to fetch questions', error);
  }
};

const startGame = () => {
  gameStarted.value = true;
  fetchQuestions();
};

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const decodedQuestion = computed(() => currentQuestion.value ? htmlDecode(currentQuestion.value.question).trim() : '');
const decodedCategory = computed(() => currentQuestion.value ? htmlDecode(currentQuestion.value.category) : '');
const shuffledAnswers = computed(() => {
  if (!currentQuestion.value) return [];
  const answers = [...currentQuestion.value.incorrect_answers, currentQuestion.value.correct_answer];
  return answers.sort(() => Math.random() - 0.5);
});

const isAnswerSelected = (answer: string) => {
  return answer === selectedAnswer.value;
};

const isAnswerCorrect = (answer: string) => {
  return feedbackVisible.value && answer === currentQuestion.value?.correct_answer;
};

const isAnswerIncorrect = (answer: string) => {
  return feedbackVisible.value && answer === selectedAnswer.value && answer !== currentQuestion.value?.correct_answer;
};

const submitAnswer = (answer: string) => {
  if (feedbackVisible.value) return; // Prevent answering while feedback is visible

  selectedAnswer.value = answer;
  feedbackVisible.value = true;

  if (answer === currentQuestion.value?.correct_answer) {
    score.value++;
  } else {
    correctAnswer.value = currentQuestion.value?.correct_answer || '';
  }

  // Move to the next question after a short delay
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
      feedbackVisible.value = false;
      selectedAnswer.value = null;
      correctAnswer.value = null;
    } else {
      isFinished.value = true;
    }
  }, 2250); // Feedback duration
};

const submitScore = async () => {
  const userEmail = user.value?.email?.replace(/\./g, '_'); // Use email as doc ID, replacing '.' to avoid Firestore issues
  const userId = userEmail || auth.currentUser?.uid || `anonymous${Date.now()}`;

  try {
    // const userDocRef = doc(db, 'leaderboard', userId);
    const userDocRef = doc(db, 'leaderboard', userId);

    // Check if the document already exists
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists() && score.value > docSnapshot.data().score) {
      // Update the existing entry
      await updateDoc(userDocRef, {
        score: score.value,
        lastUpdated: new Date(), // Add a timestamp for tracking updates
      });
    } else {
      // Add a new entry
      await setDoc(userDocRef, {
        name: user.value?.displayName || `anonymous${Date.now()}`,
        score: score.value,
        createdAt: new Date(), // Add a timestamp for tracking creation
      });
    }

    // Fetch the updated leaderboard
    fetchLeaderboard();
  } catch (error) {
    console.error('Failed to submit score', error);
    alert('There was an error submitting your score. Please try again later.');
  }
};

const fetchLeaderboard = async () => {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    leaderboard.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    console.error('Failed to fetch leaderboard', error);
  }
};

const startNewGame = () => {
  gameStarted.value = false;
  fetchQuestions();
};

const leaderboard = ref<any[]>([]);

const formatTimestamp = (timestamp: number) => {
  return format(new Date(timestamp), 'PPpp');
};

onMounted(() => {
  fetchLeaderboard();
});
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  position: fixed;
  top: 8px;
  right: 8px;
  font-size: 14px;

  @media (prefers-color-scheme: light) {
    background-color: rgb(36 36 36 / 25%);
  }

  > button {
    font-size: 14px;
  }
}

.trivia {
  hr {
    margin-block-start: 32px;
    margin-block-end: 32px;
    border-color: rgba(255, 255, 255, 0.1);

    @media (prefers-color-scheme: light) {
      border-color: rgba(0,0,0, 0.1);
    }
  }

  .preferences-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;

    h2 {
      margin-top: 0;
      margin-bottom: 24px;
    }

    > * {
      flex: 1;
    }

    select {
      border-radius: 8px;
      background: transparent;
      appearance: none;
    }

    button {
       margin-top: 16px;
    }
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
}

.question-container {

  .extra-info {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: column;

    > div {
      text-align: left;
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
      gap: 4px;
    }
  }

  h2 {
    max-width: 480px;
    margin: 0 auto 4px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    text-align: start;

    .current-index {
      text-transform: uppercase;
      font-size: 16px;
      font-weight: bold;
      opacity: 0.5;
    }
  }

  .info-label {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.5;
    & ~ *:not(.info-label) {
      text-transform: capitalize;
      font-size: 14px;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 12px;
    margin: 40px auto 0;

    li {
      list-style: none;
      display: flex;

      > * {
        flex: 1;
      }
    }
  }
}

button {
  display: block;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.correct {
  background-color: #089d4b; /* Green for correct answers */
  color: white;
}

.incorrect {
  background-color: var(--main-dark); /* Red for incorrect answers */
  color: white;
}

.default {
}

.feedback {
  margin: 20px 0;
  font-size: 18px;
}

.form-control {
  padding: 12px;
  font-size: 16px;
}

.leaderboard-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;

  h2 {
    margin: 0 auto 24px;
  }

  ul {
    padding: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .leaderboard-entry {
      text-align: left;
      list-style: none;
      display: flex;
      flex-direction: column;

      > span:first-child {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        opacity: 0.5;
      }
    }
  }
}
</style>
