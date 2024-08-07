<template>
    <div class="analytics-container">
        <h1>Analytics</h1>
        <div class="summary">
            <div class="total">
                <span>Total number of answers</span>
                <h2>{{ totalAnswers }}</h2>
            </div>
            <div class="right">
                <span>Total number of right answers</span>
                <h2>{{ totalRightAnswers }}</h2>
            </div>
            <div class="wrong">
                <span>Total number of wrong answers</span>
                <h2>{{ totalAnswers - totalRightAnswers }}</h2>
            </div>
        </div>
        <p class="loader" v-if="isLoading">Loading analytics...</p>
        <div class="charts-container" v-else>
            <div class="chart-content">
                <h2>By Category</h2>
                <div class="summary category">
                    <span v-if="categoryStats?.bestCategory"
                        ><strong>Best category</strong><br />
                        {{ htmlDecode(categoryStats.bestCategory) }} ({{
                            categoryStats?.correctAnswerRate
                        }}%)</span
                    >
                    <span v-if="categoryStats?.worstCategory">
                        <strong>Worst category</strong><br />
                        {{ categoryStats.worstCategory }} ({{
                            categoryStats?.wrongAnswerRate
                        }}%)
                    </span>
                </div>
                <Bar
                    id="category-bar-chart"
                    :options="chartOptions"
                    :data="chartCategoryData"
                />
            </div>
            <div class="chart-content">
                <h2>By Difficulty</h2>
                <Bar
                    id="difficulty-bar-chart"
                    :options="chartOptions"
                    :data="chartDifficultyData"
                />
            </div>
            <div class="chart-content">
                <h2>By Type</h2>
                <Bar
                    id="type-bar-chart"
                    :options="chartOptions"
                    :data="chartTypeData"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getDocs, orderBy, query, where } from 'firebase/firestore'
import { auth, collection, db } from '@/services/firebase'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartOptions,
    ChartData,
} from 'chart.js'
import { htmlDecode } from '@/utils/htmlDecode'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const loadingStore = useLoadingStore()
const isLoading = computed(() => loadingStore.loading)

const userStore = useUserStore()
const analytics = ref<any[]>([])
const totalAnswers = computed(() => analytics.value.length)
const totalRightAnswers = computed(
    () => analytics.value.filter((a) => a.outcome === 1).length
)

const fetchAnalytics = async () => {
    loadingStore.setLoading(true)
    try {
        const q = query(
            collection(db, 'analytics'),
            where('email', '==', userStore.userEmail),
            orderBy('answeredAt', 'desc')
        )
        const snapshot = await getDocs(q)
        analytics.value = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as any
        )
    } catch (error) {
        console.error('Failed to fetch analytics', error)
    } finally {
        loadingStore.setLoading(false)
    }
}

type OutputByCategory = {
    category: string
    total: number
    right: number
    wrong: number
}

const parsedCategoryData: Ref<OutputByCategory[]> = computed(() => {
    const data = analytics.value.map((a) => ({
        category: a.category,
        outcome: a.outcome,
    }))
    const result: {
        [key: string]: { total: number; right: number; wrong: number }
    } = {}

    data.forEach(({ category, outcome }) => {
        if (!result[category]) {
            result[category] = { total: 0, right: 0, wrong: 0 }
        }

        result[category].total += 1
        if (outcome === 1) {
            result[category].right += 1
        } else {
            result[category].wrong += 1
        }
    })

    return Object.keys(result).map((key) => ({
        category: key,
        total: result[key].total,
        right: result[key].right,
        wrong: result[key].wrong,
    }))
})

const chartCategoryData = computed(() => ({
    labels: parsedCategoryData.value.map((c) => c.category),
    datasets: [
        {
            label: 'Total',
            data: parsedCategoryData.value.map((c) => c.total),
            parsing: {
                xAxisKey: 'category',
                yAxisKey: 'total',
            },
            backgroundColor: '#0791e7',
            borderWidth: 1,
        },
        {
            label: 'Right answers',
            data: parsedCategoryData.value.map((c) => c.right),
            parsing: {
                xAxisKey: 'category',
                yAxisKey: 'right',
            },
            backgroundColor: '#1dd75e',
            borderWidth: 1,
        },
        {
            label: 'Wrong answers',
            data: parsedCategoryData.value.map((c) => c.wrong),
            parsing: {
                xAxisKey: 'category',
                yAxisKey: 'right',
            },
            backgroundColor: '#d31649',
            borderWidth: 1,
        },
    ],
}))

type BestCategoryResult = {
    bestCategory: string
    correctAnswerRate: number
    worstCategory: string
    wrongAnswerRate: number
}

const categoryStats: Ref<BestCategoryResult | null> = computed(() => {
    if (parsedCategoryData.value.length === 0) return null

    let bestCategory: OutputByCategory | null = null
    let worstCategory: OutputByCategory | null = null
    let highestRate = -1
    let highestWrongRate = -1

    parsedCategoryData.value.forEach((category) => {
        const { total, right, wrong } = category
        if (total > 0) {
            const correctAnswerRate = right / total
            const wrongAnswerRate = wrong / total

            if (correctAnswerRate > highestRate) {
                highestRate = correctAnswerRate
                bestCategory = category
            }

            if (wrongAnswerRate > highestWrongRate) {
                highestWrongRate = wrongAnswerRate
                worstCategory = category
            }
        }
    })

    return bestCategory && worstCategory
        ? {
              bestCategory: (bestCategory as OutputByCategory)?.category,
              correctAnswerRate: +(highestRate * 100).toFixed(2),
              worstCategory: (worstCategory as OutputByCategory)?.category,
              wrongAnswerRate: +(highestWrongRate * 100).toFixed(2),
          }
        : null
})

type OutputByDifficulty = {
    difficulty: string
    total: number
    right: number
    wrong: number
}

const parsedDifficultyData: Ref<OutputByDifficulty[]> = computed(() => {
    const data = analytics.value.map((a) => ({
        difficulty: a.difficulty,
        outcome: a.outcome,
    }))
    const result: {
        [key: string]: { total: number; right: number; wrong: number }
    } = {}

    data.forEach(({ difficulty, outcome }) => {
        if (!result[difficulty]) {
            result[difficulty] = { total: 0, right: 0, wrong: 0 }
        }

        result[difficulty].total += 1
        if (outcome === 1) {
            result[difficulty].right += 1
        } else {
            result[difficulty].wrong += 1
        }
    })

    return Object.keys(result).map((key) => ({
        difficulty: key,
        total: result[key].total,
        right: result[key].right,
        wrong: result[key].wrong,
    }))
})

const chartDifficultyData = computed(() => ({
    labels: parsedDifficultyData.value.map(
        (c) => c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1)
    ),
    datasets: [
        {
            label: 'Total',
            data: parsedDifficultyData.value.map((c) => c.total),
            parsing: {
                xAxisKey: 'difficulty',
                yAxisKey: 'total',
            },
            backgroundColor: '#0791e7',
            borderWidth: 1,
        },
        {
            label: 'Right answers',
            data: parsedDifficultyData.value.map((c) => c.right),
            parsing: {
                xAxisKey: 'difficulty',
                yAxisKey: 'right',
            },
            backgroundColor: '#1dd75e',
            borderWidth: 1,
        },
        {
            label: 'Wrong answers',
            data: parsedDifficultyData.value.map((c) => c.wrong),
            parsing: {
                xAxisKey: 'difficulty',
                yAxisKey: 'right',
            },
            backgroundColor: '#d31649',
            borderWidth: 1,
        },
    ],
}))

type OutputByType = {
    type: string
    total: number
    right: number
    wrong: number
}

const parsedTypeData: Ref<OutputByType[]> = computed(() => {
    const data = analytics.value.map((a) => ({
        type: a.type,
        outcome: a.outcome,
    }))
    const result: {
        [key: string]: { total: number; right: number; wrong: number }
    } = {}

    data.forEach(({ type, outcome }) => {
        if (!result[type]) {
            result[type] = { total: 0, right: 0, wrong: 0 }
        }

        result[type].total += 1
        if (outcome === 1) {
            result[type].right += 1
        } else {
            result[type].wrong += 1
        }
    })

    return Object.keys(result).map((key) => ({
        type: key,
        total: result[key].total,
        right: result[key].right,
        wrong: result[key].wrong,
    }))
})

const chartTypeData = computed(() => ({
    labels: parsedTypeData.value.map(
        (c) => c.type.charAt(0).toUpperCase() + c.type.slice(1)
    ),
    datasets: [
        {
            label: 'Total',
            data: parsedTypeData.value.map((c) => c.total),
            parsing: {
                xAxisKey: 'type',
                yAxisKey: 'total',
            },
            backgroundColor: '#0791e7',
            borderWidth: 1,
        },
        {
            label: 'Right answers',
            data: parsedTypeData.value.map((c) => c.right),
            parsing: {
                xAxisKey: 'difficulty',
                yAxisKey: 'right',
            },
            backgroundColor: '#1dd75e',
            borderWidth: 1,
        },
        {
            label: 'Wrong answers',
            data: parsedTypeData.value.map((c) => c.wrong),
            parsing: {
                xAxisKey: 'difficulty',
                yAxisKey: 'right',
            },
            backgroundColor: '#d31649',
            borderWidth: 1,
        },
    ],
}))

const chartOptions: Ref<ChartOptions> = computed(() => ({
    responsive: true,
    aspectRatio: 1.25,
}))

onMounted(() => {
    fetchAnalytics()
    auth.onAuthStateChanged((currentUser) => {
        fetchAnalytics()
    })
})
</script>

<style lang="scss" scoped>
.analytics-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;

    h1 {
        text-align: center;
    }

    .loader {
        text-align: center;
    }

    .summary {
        display: flex;
        gap: 8px;
        margin-block-end: 16px;
        flex-wrap: wrap;
        justify-content: center;

        > div {
            background-color: #151515;
            padding: 16px;
            border-radius: 8px;

            h2 {
                margin: 0;
            }

            &.total {
                border: 1px solid #0791e7;
            }

            &.right {
                border: 1px solid #1dd75e;
            }

            &.wrong {
                border: 1px solid #d31649;
            }
        }

        &.category {
            margin-bottom: 32px;
            justify-content: space-between;

            > span > strong {
                text-transform: uppercase;
                font-size: 12px;
                font-weight: bold;
                opacity: 0.5;
            }
        }
    }

    .charts-container {
        min-width: 560px;
        padding-bottom: 64px;
        display: block;

        @media (min-width: 768px) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin: auto;
        }

        .chart-content {
            max-width: 30dvw;
            width: 100%;
            background-color: #151515;
            padding: 16px 32px;
            border-radius: 8px;
        }
    }
}
</style>
