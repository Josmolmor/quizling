<template>
    <div class="analytics-container">
        <h1>Analytics</h1>
        <div class="summary">
            <div class="total">
                <span>
                    <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:svg="http://www.w3.org/2000/svg"
                    >
                        <g class="layer">
                            <title>Layer 1</title>
                            <g id="SVGRepo_bgCarrier" stroke-width="0" />
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="m20,14l-17,0"
                                    id="svg_1"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                />
                                <path
                                    d="m19.98,18l-16.98,0"
                                    id="svg_2"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                    transform="matrix(1 0 0 1 0 0)"
                                />
                                <path
                                    d="m3,6l10.5,0m6.5,0l-2.25,0"
                                    id="svg_4"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                />
                                <path
                                    d="m20,10l-10.5,0m-6.5,0l2.25,0"
                                    id="svg_5"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                />
                            </g>
                        </g>
                    </svg>
                    Total answers</span
                >
                <h2>{{ totalAnswers }}</h2>
            </div>
            <div class="right">
                <span>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M14 16L16.1 18.5L20 13.5"
                                stroke="#ffffff"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            <path
                                d="M10 14H3"
                                stroke="#ffffff"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M10 18H3"
                                stroke="#ffffff"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M3 6L13.5 6M20 6L17.75 6"
                                stroke="#ffffff"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M20 10L9.5 10M3 10H5.25"
                                stroke="#ffffff"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                        </g>
                    </svg>
                    Right answers
                </span>
                <h2>
                    {{ totalRightAnswers }}
                </h2>
            </div>
            <div class="wrong">
                <span>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M15 18.5L20 13.5M20 18.5L15 13.5"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            <path
                                d="M11 14L3 14"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M11 18H3"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M3 6L13.5 6M20 6L17.75 6"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M20 10L9.5 10M3 10H5.25"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                        </g>
                    </svg>
                    Wrong answers
                </span>
                <h2>
                    <span>{{ totalAnswers - totalRightAnswers }}</span>
                </h2>
            </div>
            <div v-if="analyticsStore.highestStreak" class="streak">
                <span>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M11 14L3 14"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M11 18H3"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M20 16.5L17.5 14M17.5 14L15 16.5M17.5 14V20"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            <path
                                d="M3 6L13.5 6M20 6L17.75 6"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                            <path
                                d="M20 10L9.5 10M3 10H5.25"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            ></path>
                        </g>
                    </svg>
                    Highest streak</span
                >
                <h2>
                    {{ analyticsStore.highestStreak }}
                </h2>
            </div>
        </div>
        <p class="loader" v-if="isLoading">Loading analytics...</p>
        <div class="charts-container" v-else>
            <div class="chart-content">
                <div class="buttons-container">
                    <h2>By Category</h2>
                    <button
                        :class="{
                            inactive: categoryMode === 'timed',
                        }"
                        @click="setCategoryMode('standard')"
                    >
                        Standard
                    </button>
                    <button
                        :class="{
                            inactive: categoryMode === 'standard',
                        }"
                        @click="setCategoryMode('timed')"
                    >
                        Timed
                    </button>
                </div>
                <Bar
                    id="category-bar-chart"
                    :options="chartOptions"
                    :data="chartCategoryData"
                />
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
            </div>
            <div class="chart-content">
                <div class="buttons-container">
                    <h2>By day</h2>
                    <button
                        :class="{
                            inactive: dayMode === 'timed',
                        }"
                        @click="setDayMode('standard')"
                    >
                        Standard
                    </button>
                    <button
                        :class="{
                            inactive: dayMode === 'standard',
                        }"
                        @click="setDayMode('timed')"
                    >
                        Timed
                    </button>
                </div>
                <Line
                    id="performance-bar-chart"
                    :options="chartOptions"
                    :data="chartPerformanceData"
                />
            </div>
            <div class="chart-content">
                <div class="buttons-container">
                    <h2>By Difficulty</h2>
                    <button
                        :class="{
                            inactive: difficultyMode === 'timed',
                        }"
                        @click="setDifficultyMode('standard')"
                    >
                        Standard
                    </button>
                    <button
                        :class="{
                            inactive: difficultyMode === 'standard',
                        }"
                        @click="setDifficultyMode('timed')"
                    >
                        Timed
                    </button>
                </div>
                <Bar
                    id="difficulty-bar-chart"
                    :options="chartOptions"
                    :data="chartDifficultyData"
                />
            </div>
            <div class="chart-content">
                <div class="buttons-container">
                    <h2>By Type</h2>
                    <button
                        :class="{
                            inactive: typeMode === 'timed',
                        }"
                        @click="setTypeMode('standard')"
                    >
                        Standard
                    </button>
                    <button
                        :class="{
                            inactive: typeMode === 'standard',
                        }"
                        @click="setTypeMode('timed')"
                    >
                        Timed
                    </button>
                </div>
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
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import { Bar, Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartOptions,
    LineElement,
    PointElement,
    LineController,
    BarController,
} from 'chart.js'
import { htmlDecode } from '@/utils/htmlDecode'
import { useAnalyticsStore } from '@/stores/analytics'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    LineController,
    BarController
)

type StatMode = 'standard' | 'timed'

const categoryMode = ref<StatMode>('standard')
const setCategoryMode = (value: StatMode) => {
    categoryMode.value = value
}

const dayMode = ref<StatMode>('standard')
const setDayMode = (value: StatMode) => {
    dayMode.value = value
}

const difficultyMode = ref<StatMode>('standard')
const setDifficultyMode = (value: StatMode) => {
    difficultyMode.value = value
}

const typeMode = ref<StatMode>('standard')
const setTypeMode = (value: StatMode) => {
    typeMode.value = value
}

const loadingStore = useLoadingStore()
const isLoading = computed(() => loadingStore.loading)
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()

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
            where('email', '==', userStore.userEmail)
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
    const data =
        categoryMode.value === 'timed'
            ? analytics.value
                  .filter((v) => v.timedMode)
                  .map((a) => ({
                      category: a.category,
                      outcome: a.outcome,
                  }))
            : analytics.value.map((a) => ({
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
    labels: parsedCategoryData.value.map((c) => htmlDecode(c.category)),
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
            backgroundColor: '#EC0640',
            borderWidth: 1,
        },
    ],
}))

type OutputByPerformance = {
    date: string
    total: number
    right: number
    wrong: number
}

const parsedPerformanceData: Ref<OutputByPerformance[]> = computed(() => {
    const entries =
        dayMode.value === 'standard'
            ? analytics.value
                  .map((a) => ({
                      answeredAt: a.answeredAt,
                      outcome: a.outcome,
                  }))
                  .sort((x, y) => {
                      return x.answeredAt - y.answeredAt
                  })
            : analytics.value
                  .filter((v) => v.timedMode)
                  .map((a) => ({
                      answeredAt: a.answeredAt,
                      outcome: a.outcome,
                  }))
                  .sort((x, y) => {
                      return x.answeredAt - y.answeredAt
                  })

    const result: { [key: string]: OutputByPerformance } = {}
    entries.forEach((entry) => {
        // Convert timestamp to a readable date (YYYY-MM-DD)
        const date = new Date(entry.answeredAt).toISOString().split('T')[0]

        // If the date key doesn't exist in the result, create it
        if (!result[date]) {
            result[date] = { date, total: 0, right: 0, wrong: 0 }
        }

        // Increment the total count
        result[date].total += 1

        // Check if the outcome is "1" (right)
        if (entry.outcome === 1) {
            result[date].right += 1
        }

        // Calculate the wrong count as total - right
        result[date].wrong = result[date].total - result[date].right
    })

    // Convert the result object into an array of OutputEntry
    return Object.values(result)
})

const chartPerformanceData = computed(() => ({
    labels: parsedPerformanceData.value.map((c) => c.date),
    datasets: [
        {
            label: 'Total',
            data: parsedPerformanceData.value.map((c) => c.total),
            parsing: {
                xAxisKey: 'date',
                yAxisKey: 'total',
            },
            backgroundColor: '#0791e7',
            borderWidth: 1,
            borderColor: '#0791e7',
        },
        {
            label: 'Right answers',
            data: parsedPerformanceData.value.map((c) => c.right),
            parsing: {
                xAxisKey: 'date',
                yAxisKey: 'right',
            },
            backgroundColor: '#1dd75e',
            borderWidth: 1,
            borderColor: '#1dd75e',
        },
        {
            label: 'Wrong answers',
            data: parsedPerformanceData.value.map((c) => c.wrong),
            parsing: {
                xAxisKey: 'date',
                yAxisKey: 'wrong',
            },
            backgroundColor: '#EC0640',
            borderWidth: 1,
            borderColor: '#EC0640',
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
    const data =
        difficultyMode.value === 'standard'
            ? analytics.value.map((a) => ({
                  difficulty: a.difficulty,
                  outcome: a.outcome,
              }))
            : analytics.value
                  .filter((a) => a.timedMode)
                  .map((a) => ({
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
            backgroundColor: '#EC0640',
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
    const data =
        typeMode.value === 'standard'
            ? analytics.value.map((a) => ({
                  type: a.type,
                  outcome: a.outcome,
              }))
            : analytics.value
                  .filter((a) => a.timedMode)
                  .map((a) => ({
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
            backgroundColor: '#EC0640',
            borderWidth: 1,
        },
    ],
}))

const chartOptions: Ref<ChartOptions> = computed(() => ({
    responsive: true,
    aspectRatio: 1.25,
    plugins: {
        legend: {
            labels: {
                color: 'white',
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255,255,255,0.05)',
            },
            ticks: {
                callback: function (value) {
                    const maxChars = 10
                    const label = this.getLabelForValue(value as any)
                    return `${label.substr(0, maxChars)}${label.length > maxChars ? '...' : ''}`
                },
            },
        },
        y: {
            grid: {
                color: 'rgba(255,255,255,0.1)',
            },
        },
    },
}))

onMounted(() => {
    fetchAnalytics()
    analyticsStore.fetchHighestStreak()
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
            flex: 1;

            span {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-bottom: 4px;
                flex-wrap: wrap;

                > svg {
                    height: 24px;
                }
            }

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
                border: 1px solid #ec0640;
            }

            &.streak {
                border: 1px solid var(--accent);
            }
        }

        &.category {
            margin-top: 32px;
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
        padding-bottom: 64px;
        display: block;
        width: 100%;

        @media (min-width: 768px) {
            min-width: 560px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin: auto;
        }

        .chart-content {
            background-color: #151515;
            padding: 24px 32px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 16px;

            @media (min-width: 768px) {
                width: 100%;
                max-width: 33dvw;
                margin: 0 auto;
                align-self: flex-start;
            }

            h2 {
                flex-shrink: 0;
                margin: 0 auto 0 0;
            }

            .buttons-container {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-wrap: wrap;

                button {
                    flex-shrink: 0;
                    padding: 4px 8px;

                    &.inactive {
                        border: 1px solid var(--main);
                        background-color: transparent;

                        &:hover:enabled {
                            background-color: var(--main);
                        }
                    }
                }
            }
        }
    }
}
</style>
