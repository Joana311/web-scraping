import React from 'react'
import { useRouter } from 'next/router'
import trpc from '@client/trpc'
import { Exercise } from '@prisma/client'
import debounce from 'lodash/debounce'
import { useDebounce } from '@client/hooks'

type ExerciseDirectoryContext = {
    exercises: Exercise[] | undefined
    searchQuery: string
    updateSearchQuery: (query: string, should_debounce: boolean) => void
    updateSearchFilters: (filters: string[]) => void
}
type ExerciseProvider = {
    children: React.ReactNode
    exercise_directory?: Exercise[]
}

const ExDirectoryContext = React.createContext<ExerciseDirectoryContext | undefined>(undefined)

export const useUpdateSearchQuery = () => {
    const context = React.useContext(ExDirectoryContext)
    if (!context) {
        throw new Error('useUpdateSearchQuery must be used within a ExerciseDirectoryProvider')
    }
    return context.updateSearchQuery
}
export const useExerciseDirectory = () => {
    const context = React.useContext(ExDirectoryContext)
    if (!context) {
        throw new Error('useExerciseDirectory must be used within a ExerciseDirectoryProvider')
    }
    return context.exercises
}

export const useSearchQuery = () => {
    const context = React.useContext(ExDirectoryContext)
    if (!context) {
        throw new Error('useSearchQuery must be used within a ExerciseDirectoryProvider')
    }
    return context.searchQuery
}
export const ExerciseProvider = ({ children }: ExerciseProvider) => {
    const router = useRouter()
    const queryContext = trpc.useContext()
    const [searchQuery, setSearchQuery] = React.useState('')
    const exrx_directory = queryContext.getQueryData(['exercise.public.directory'])
    const [directory, setDirectory] = React.useState(exrx_directory)
    const [searchFilters, setSearchFilters] = React.useState<string[]>([])

    // let term = router.query.term as string
    const { data: searchQueryResults } = trpc.useQuery(['exercise.public.search_exercises', { query: searchQuery }], {
        enabled: (!!searchQuery || searchQuery != ''), staleTime: Infinity,
        onSuccess: (data) => {
            setDirectory(data)
        }
    });
    const update_query = (search_query: string) => {
        setSearchQuery(search_query);
        router.replace({ query: { ...router.query, term: search_query } })
    }
    const debouncedQueryUpdate = React.useMemo(() => debounce(update_query, 800), [])

    // React.useEffect(() => {
    //     console.log('search state', searchQuery)
    //     // if (searchQuery.length === 0) {
    //         //     debouncedRouterUpdate.cancel()
    //     //     update_router_query('')
    //     //     delete router.query["term"]
    //     //     return
    //     // }
    //     // debouncedRouterUpdate(searchQuery)
    //     // return debouncedRouterUpdate.cancel
    // }, [searchQuery])

    React.useEffect(() => {
        console.log('search state', searchQuery)
        if (searchQuery.length == 0 || searchQuery == '') {
            console.log("should be setting to exrx")
            setDirectory(exrx_directory)
            return
        }
        // let searchResult = queryContext.getQueryData(['exercise.public.search_exercises', { query: searchQuery }]) || []
        // console.log("search result", searchResult)
        // setDirectory(searchResult);
        // return setDirectory(exrx_directory)
    }, [searchQuery])
    // create useEffect to monitor router.query.term in console.log
    React.useEffect(() => {
        console.log('router: ', router.query.term)
    }, [router.query.term])

    const updateSearchQuery = (search_term: string, should_debounce: boolean) => {
        if (search_term.trim() == '') {
            setSearchQuery('')
            router.replace({ query: { ...router.query, term: '' } })
            delete router.query["term"]
            debouncedQueryUpdate.cancel()
            return
        }
        if (should_debounce) {
            debouncedQueryUpdate(search_term.trim())
        }
        else {
            update_query(search_term.trim())
        }
    }

    const updateSearchFilters = (filters: string[]) => {
        const ctx = React.useContext(ExDirectoryContext)
        if (!ctx) {
            throw new Error('useUpdateSearchFilters must be used within a SearchProvider')
        }
        setSearchFilters(filters)
    }

    const value = React.useMemo(() => ({ exercises: directory, updateSearchQuery, updateSearchFilters, searchQuery }), [directory, searchQuery])

    return <ExDirectoryContext.Provider value={value}>{children}</ExDirectoryContext.Provider>
}

