import React, { useState, useContext} from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [error, setError] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
  })

  const fetchQuiz = async (u) => {
    setLoading(true)
    try {
      const response = await fetch(u)
      const data = await response.json()
      const fetchData = data.results
      if (fetchData.length > 0) {
        setQuestions(fetchData)
        setWaiting(false)
        setLoading(false)
        setError(false)
      } else {
        setWaiting(true)
        setLoading(false)
        setError(true)
      }
      
    } catch (error) {
      console.log(error)
    }
    
  }
  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1
      if (index > questions.length - 1) {
        openModal()
        return 0
      } else {
        return index
      }
    })
  }
  const correctAnswer = (value) => {
    if (value) {
      setCorrect(oldState => oldState + 1)
    }
    nextQuestion()
  }
  const openModal = () => {
    setIsModal(true)
  }
  const closeModal = () => {
    setIsModal(false)
    setWaiting(true)
    setCorrect(0)
  }
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setQuiz({...quiz,[name]:value})
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const { category, difficulty, amount } = quiz
    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`
    fetchQuiz(url)
  }

  const value = {
    waiting,
    loading,
    questions,
    index,
    correct,
    error,
    isModal,
    quiz,
    correctAnswer,
    nextQuestion,
    openModal,
    closeModal,
    handleSubmit,
    handleChange
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
