import axios from 'axios'

const API_URL = 'https://opentdb.com/api.php'

export interface TriviaQuestion {
    category: string
    type: string
    difficulty: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

interface FetchTriviaQuestionsParams {
    category: string
    difficulty: string
    type: string
    amount: number
}

export const fetchTriviaQuestions = async (
    params: FetchTriviaQuestionsParams
): Promise<TriviaQuestion[]> => {
    const { category, difficulty, type, amount } = params
    const categoryParam = category === 'any' ? '' : `&category=${category}`
    const difficultyParam =
        difficulty === 'any' ? '' : `&difficulty=${difficulty}`
    const typeParam = type === 'any' ? '' : `&type=${type}`

    const response = await axios.get(API_URL, {
        params: {
            amount: amount, // Number of questions
            ...(categoryParam && { category }),
            ...(difficultyParam && { difficulty }),
            ...(typeParam && { type }),
        },
    })

    return response.data.results
}
