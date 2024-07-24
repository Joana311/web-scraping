import React from 'react'
import { useRouter } from 'next/router'
import trpcNextHooks from '@client/trpc'
import { Exercise } from '@prisma/client'
import debounce from 'lodash/debounce'
type ExerciseDirectoryContext = {
    exercises: Exercise[] | undefined
    searchQuery: string
    searchFilters: string[]
    useUpdateSearchQuery: (query: string, should_debounce: boolean) => void
    useUpdateSearchFilters?: (filters: string[]) => void
}
type ExerciseProvider = {
    children: React.ReactNode
    exercise_directory?: Exercise[]
}

const ExDirectoryContext = React.createContext<ExerciseDirectoryContext | undefined>(undefined)
export const useSearchFilters = () => {
    const ctx = React.useContext(ExDirectoryContext)
    if (!ctx) {
        throw new Error('useSearchFilters must be used within a SearchProvider')
    }
    return ctx.searchFilters
}
export const useUpdateSearchQuery = () => {
    const context = React.useContext(ExDirectoryContext)
    if (!context) {
        throw new Error('useUpdateSearchQuery must be used within a ExerciseDirectoryProvider')
    }
    return context.useUpdateSearchQuery
}
export const useExerciseDirectory = () => {
    const context = React.useContext(ExDirectoryContext)
    if (!context) {
        throw new Error('useExerciseDirectory must be used within a ExerciseDirectoryProvider')
    }
    return context.exercises
}
export const useUpdateSearchFilters = () => {
    const context = React.useContext(ExDirectoryContext)
    if (!context) {
        throw new Error('useUpdateSearchFilters must be used within a ExerciseDirectoryProvider')
    }
    return context.useUpdateSearchFilters
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
    const queryContext = trpcNextHooks.useContext()
    const [searchQuery, setSearchQuery] = React.useState('')
    const exrx_directory = queryContext.exercise.public_directory.getData()
    const [directory, setDirectory] = React.useState(exrx_directory)
    const [searchFilters, setSearchFilters] = React.useState<string[]>([])

    const { data: searchQueryResults } = trpcNextHooks.exercise.public_search_exercises
        .useQuery({ query: searchQuery }, {
            enabled: (!!searchQuery || searchQuery != ''), staleTime: Infinity,
    });
    const update_query = (search_query: string) => {
        setSearchQuery(search_query);
        router.replace({ query: { ...router.query, term: search_query } })
    }
    const debouncedQueryUpdate = React.useMemo(() => debounce(update_query, 280), [])

    const getFilteredFallback = (search_query: string) => {
        return exrx_directory ? exrx_directory.filter(ex => ex.name.toLowerCase().includes(search_query.toLowerCase())) : []
    }

    React.useEffect(() => {
        // console.log('search state', searchQuery)
        if (searchQueryResults && searchQueryResults.length == 0 && searchQuery.length > 0) {
            // console.log("should be setting to exrx")
            setDirectory(getFilteredFallback(searchQuery))
            return
        }
        if (searchQuery.length === 0) {
            setDirectory(exrx_directory)
            return
        }
        let searchResult = queryContext.exercise.public_search_exercises
            .getData({ query: searchQuery }) || []
        // console.log("search result", searchResult)
        setDirectory(searchResult);
        // return setDirectory(exrx_directory)
    }, [searchQueryResults, searchQuery])

    const useUpdateSearchQuery = (search_term: string, should_debounce: boolean) => {
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

    const useUpdateSearchFilters = (filters: string[]) => {
        router.replace({
            query: { ...router.query, tags: filters }
        })
        setSearchFilters(filters)
    }

    const value = React.useMemo(() => ({ exercises: directory, useUpdateSearchQuery, useUpdateSearchFilters, searchQuery, searchFilters }), [directory, searchQuery, searchFilters])

    return <ExDirectoryContext.Provider value={value}>{children}</ExDirectoryContext.Provider>
}

