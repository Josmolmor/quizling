<template>
    <div class="trivia">
        <div v-if="!gameStore.gameStarted" class="preferences-container">
            <h1>Play</h1>
            <label for="category">
                <span>Category</span>
                <select
                    v-model="selectedCategory"
                    class="form-control"
                    id="category"
                >
                    <option value="any">Select a category</option>
                    <option value="9">General Knowledge</option>
                    <option value="10">Entertainment: Books</option>
                    <option value="11">Entertainment: Film</option>
                    <option value="12">Entertainment: Music</option>
                    <option value="13">
                        Entertainment: Musicals &amp; Theatres
                    </option>
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
                    <option value="31">
                        Entertainment: Japanese Anime &amp; Manga
                    </option>
                    <option value="32">
                        Entertainment: Cartoon &amp; Animations
                    </option>
                </select>
            </label>
            <label for="difficulty">
                <span>Difficulty</span>
                <select
                    v-model="selectedDifficulty"
                    class="form-control"
                    id="difficulty"
                >
                    <option value="any">Select a difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </label>
            <label for="type">
                <span>Type</span>
                <select v-model="selectedType" class="form-control" id="type">
                    <option value="any">Select a type</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                </select>
            </label>
            <label for="amount">
                <span>Number of questions</span>
                <select
                    v-model="selectedAmount"
                    class="form-control"
                    id="amount"
                >
                    <option
                        v-for="num in questionOptions"
                        :key="num"
                        :value="num"
                    >
                        {{ num }} questions
                    </option>
                </select>
            </label>
            <div class="button-container start">
                <button @click="startGame(false)">Standard mode</button>
                <div class="badge-button">
                    <span class="notify-badge">NEW</span>
                    <button @click="startGame(true)">
                        <StopwatchIcon />
                        Timed mode
                    </button>
                </div>
            </div>
            <label class="analytics-check" v-if="store.userEmail">
                <input
                    type="checkbox"
                    @change="analyticsTrackingToggle"
                    :checked="!analyticsStore.trackAnalytics"
                />
                Check this if you <strong>don't</strong> want to track your
                analytics the next round of questions
            </label>
        </div>
        <div
            v-else-if="questions.length && !isFinished"
            class="question-container"
        >
            <div v-if="gameStore.isOnARoll" class="bolt-container">
                <BoltIcon class="bolt-icon" />
                <span
                    ><strong>You're on a roll!</strong> From now on, each
                    correct answer is worth double points</span
                >
            </div>
            <Countdown
                v-if="gameStore.isTimedMode"
                :initial-time="selectedAmount * 5"
                :pending-answers="
                    questions.length + 1 - (currentQuestionIndex + 1)
                "
                @on-finished="countdownFinished"
            />
            <h2>
                <span class="current-index"
                    >#{{ currentQuestionIndex + 1 }}/{{
                        questions.length
                    }}</span
                >
                {{ decodedQuestion }}
            </h2>
            <div class="extra-info">
                <div>
                    <span class="info-label">Category: </span
                    ><span>{{ decodedCategory }}</span>
                </div>
                <div>
                    <span class="info-label">Difficulty: </span
                    ><span>{{ currentQuestion.difficulty }}</span>
                </div>
            </div>
            <ul>
                <li v-for="answer in shuffledAnswers" :key="answer">
                    <button
                        :class="{
                            correct: isAnswerCorrect(answer),
                            incorrect: isAnswerIncorrect(answer),
                            default:
                                !isAnswerSelected(answer) &&
                                !isAnswerCorrect(answer),
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
        <div class="outcome" v-if="isFinished">
            <h2>Your score: {{ gameStore.pointsTotal }}</h2>
            <p>
                Answered a total of
                <strong>{{ questions.length }} questions</strong>
                <br />
                <span v-if="gameStore.maxStreak">
                    Achieved a streak of
                    <strong
                        >{{ gameStore.maxStreak }} correct answers in a
                        row</strong
                    ></span
                >
            </p>
            <p v-if="gameStore.isTimedMode && timeRanOut">
                You ran out of time
            </p>
            <Pie
                :data="{
                    labels: ['Right', 'Wrong'],
                    datasets: [
                        {
                            backgroundColor: ['#1dd75e', '#EC0640'],
                            data: [score, questions.length - score],
                            borderWidth: 0,
                        },
                    ],
                }"
                :options="{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: 'white',
                            },
                        },
                    },
                }"
            />
            <p v-if="store.userEmail">
                <span v-if="analyticsStore.personalBest > 0"
                    >Your best score before this attempt was
                    <strong>{{ analyticsStore.personalBest }}</strong></span
                ><br />
                <span v-if="gameStore.pointsTotal > analyticsStore.personalBest"
                    >Congrats! you got a new personal high score</span
                >
            </p>
            <div class="button-container">
                <button @click="startNewGame">Start New Game</button>
                <button
                    v-if="
                        gameStore.pointsTotal > 0 &&
                        ((store.userEmail &&
                            gameStore.pointsTotal >
                                analyticsStore.personalBest) ||
                            !store.userEmail)
                    "
                    @click="submitScore"
                >
                    Submit Score
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { fetchTriviaQuestions, TriviaQuestion } from '@/services/trivia'
import { htmlDecode } from '@/utils/htmlDecode'
import {
    auth,
    db,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    collection,
    addDoc,
} from '@/services/firebase'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useUserStore } from '@/stores/user'
import { useAnalyticsStore } from '@/stores/analytics'
import { toast } from '@steveyuowo/vue-hot-toast'
import StopwatchIcon from '@/components/StopwatchIcon.vue'
import Countdown from '@/components/Countdown.vue'
import { useGameStore } from '@/stores/game'
import BoltIcon from '@/components/BoltIcon.vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const questions = ref<TriviaQuestion[]>([])
const currentQuestionIndex = ref(0)
const score = ref(0)
const isFinished = ref(false)

const selectedCategory = ref('any')
const selectedDifficulty = ref('any')
const selectedType = ref('any')
const selectedAmount = ref(5)
const selectedAnswer = ref<string | null>(null)
const correctAnswer = ref<string | null>(null)
const feedbackVisible = ref(false)

const store = useUserStore()
const analyticsStore = useAnalyticsStore()
const gameStore = useGameStore()

const questionOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

const fetchQuestions = async () => {
    try {
        currentQuestionIndex.value = 0
        score.value = 0
        isFinished.value = false
        feedbackVisible.value = false
        selectedAnswer.value = null
        correctAnswer.value = null

        questions.value = await fetchTriviaQuestions({
            category: selectedCategory.value,
            difficulty: selectedDifficulty.value,
            type: selectedType.value,
            amount: selectedAmount.value,
        })
    } catch (error) {
        console.error('Failed to fetch questions', error)
    }
}

const analyticsTrackingToggle = async (e: Event) => {
    return analyticsStore.setAnalyticsTracking(
        !(e.target as HTMLInputElement).checked
    )
}

const startGame = async (timed: boolean) => {
    gameStore.setTimedMode(timed)
    await fetchQuestions()
    gameStore.setGameStarted(true)
}

const timeRanOut = ref(false)
const countdownFinished = () => {
    isFinished.value = true
    timeRanOut.value = true
}

const currentQuestion = computed(
    () => questions.value[currentQuestionIndex.value]
)
const decodedQuestion = computed(() =>
    currentQuestion.value
        ? htmlDecode(currentQuestion.value.question).trim()
        : ''
)
const decodedCategory = computed(() =>
    currentQuestion.value ? htmlDecode(currentQuestion.value.category) : ''
)
const shuffledAnswers = computed(() => {
    if (!currentQuestion.value) return []
    const answers = [
        ...currentQuestion.value.incorrect_answers,
        currentQuestion.value.correct_answer,
    ]
    return answers.sort(() => Math.random() - 0.5)
})

const isAnswerSelected = (answer: string) => {
    return answer === selectedAnswer.value
}

const isAnswerCorrect = (answer: string) => {
    return (
        feedbackVisible.value &&
        answer === currentQuestion.value?.correct_answer
    )
}

const isAnswerIncorrect = (answer: string) => {
    return (
        feedbackVisible.value &&
        answer === selectedAnswer.value &&
        answer !== currentQuestion.value?.correct_answer
    )
}

const trackAnswerAnalytic = async (correct: boolean) => {
    const timestamp = Date.now()
    const category = currentQuestion.value.category
    const difficulty = currentQuestion.value.difficulty
    const type = currentQuestion.value.type
    const outcome = correct ? 1 : 0
    const answeredAt = timestamp
    const streak = gameStore.streakMode

    await addDoc(collection(db, 'analytics'), {
        email: store.userEmail,
        question: decodedQuestion.value,
        category,
        difficulty,
        type,
        outcome,
        answeredAt,
        ...(gameStore.isOnARoll ? { streak } : {}),
        ...(gameStore.isTimedMode ? { timedMode: gameStore.isTimedMode } : {}),
    })
}

const submitAnswer = (answer: string) => {
    const correct = answer === currentQuestion.value?.correct_answer

    // only track answer if user is logged in
    if (store.userEmail && analyticsStore.trackAnalytics) {
        trackAnswerAnalytic(correct)
    }

    if (feedbackVisible.value) return // Prevent answering while feedback is visible

    selectedAnswer.value = answer
    feedbackVisible.value = true

    if (correct) {
        score.value++
        gameStore.setPointsTotal(1)
        gameStore.setStreakMode()
    } else {
        gameStore.setStreakMode(true)
        correctAnswer.value = currentQuestion.value?.correct_answer || ''
    }

    // Move to the next question after a short delay
    setTimeout(() => {
        if (currentQuestionIndex.value < questions.value.length - 1) {
            currentQuestionIndex.value++
            feedbackVisible.value = false
            selectedAnswer.value = null
            correctAnswer.value = null
        } else {
            isFinished.value = true
        }
    }, 2250) // Feedback duration
}

const submitScore = async () => {
    const userEmail = store.userEmail.replace(/\./g, '_') // Use email as doc ID, replacing '.' to avoid Firestore issues
    const userId =
        userEmail || auth.currentUser?.uid || `anonymous${Date.now()}`

    try {
        // const userDocRef = doc(db, 'leaderboard', userId);
        const userDocRef = doc(db, 'leaderboard', userId)

        // Check if the document already exists
        const docSnapshot = await getDoc(userDocRef)

        if (
            docSnapshot.exists() &&
            score.value >
                (gameStore.isTimedMode
                    ? docSnapshot.data().timedScore
                    : docSnapshot.data().normalScore)
        ) {
            // Update the existing entry
            await updateDoc(userDocRef, {
                lastUpdated: new Date(), // Add a timestamp for tracking updates
                ...(gameStore.isTimedMode
                    ? {
                          timedScore: gameStore.pointsTotal,
                          timedMode: gameStore.isTimedMode,
                      }
                    : {
                          normalScore: gameStore.pointsTotal,
                      }),
            })
        } else {
            // Add a new entry
            await setDoc(
                userDocRef,
                {
                    name: store.displayName || `anonymous${Date.now()}`,
                    createdAt: new Date(), // Add a timestamp for tracking creation
                    ...(gameStore.isTimedMode
                        ? {
                              timedScore: gameStore.pointsTotal,
                              timedMode: gameStore.isTimedMode,
                          }
                        : {
                              normalScore: gameStore.pointsTotal,
                          }),
                },
                { merge: true }
            )
        }
        toast.success('Score updated!')
        startNewGame()
    } catch (error) {
        console.error('Failed to submit score', error)
        toast.error(
            'There was an error submitting your score. Please try again later.'
        )
    }
}

const startNewGame = () => {
    gameStore.setGameStarted(false)
    gameStore.setStreakMode(true)
    gameStore.setPointsTotal(0)
    fetchQuestions()
}
</script>

<style scoped lang="scss">
.trivia {
    max-width: 480px;
    margin: auto;
    width: 100%;

    h2 {
        text-align: center;
    }

    .preferences-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        justify-content: center;
        text-align: center;

        h1 {
            margin: 0 auto;
        }

        label:not(.analytics-check) {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;

            > span {
                display: block;
                margin-bottom: 4px;
                text-align: left;
            }
        }

        select {
            flex: 1;
            border-radius: 8px;
            background: transparent;
            appearance: none;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin: 16px 0;

            > svg {
                width: 19px;
            }
        }
    }

    .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;

        .badge-button {
            position: relative;
            .notify-badge {
                pointer-events: none;
                font-weight: bold;
                position: absolute;
                right: -24px;
                top: -4px;
                background: var(--accent);
                text-align: center;
                border-radius: 24px;
                color: black;
                padding: 6px 12px;
                font-size: 12px;
            }
        }
    }

    .analytics-check {
        font-size: 14px;
    }
}

.question-container {
    position: relative;

    .bolt-container {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 360px;
        width: 100%;
        gap: 16px;
        position: absolute;
        top: -120px;
        left: 50%;
        transform: translateX(-50%);
        border: 1px solid rgb(255 235 0);
        border-radius: 8px;
        padding: 8px;
        background-color: rgba(255, 235, 0, 0.025);

        .bolt-icon {
            flex-shrink: 0;
            height: 48px;
            width: 48px;
            color: var(--accent);
        }
    }

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

.feedback {
    margin: 20px 0;
    font-size: 18px;
}

.form-control {
    padding: 12px;
    font-size: 16px;
}

.outcome {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 24px;

    h2 {
        margin: 0;
    }

    p {
        margin: 0 auto;
    }

    canvas {
        max-width: 320px;
        object-fit: contain;
        margin: 0 auto;
    }
}
</style>
