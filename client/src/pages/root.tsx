import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import axios from 'axios'
import PageContainer from '../components/PageContainer'
import { MatchInterface } from 'server/models/match.model'
import moment from 'moment'

const Root = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playerNames, setPlayerNames] = useState({
        playerOne: '',
        playerTwo: ''
    })
    const [errorMessage, setErrorMessage] = useState('')
    const [matchHistory, setMatchHistory] = useState<MatchInterface[]>()
    const navigate = useNavigate()

    const handleModal = (e?: React.MouseEvent) => {
        setIsModalOpen(!isModalOpen)
        if(e){
            e.stopPropagation()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedPlayerNames = {
            playerOne: playerNames.playerOne.trim(),
            playerTwo: playerNames.playerTwo.trim()
        }
        if (!trimmedPlayerNames.playerOne || !trimmedPlayerNames.playerTwo) {
            setErrorMessage('Please enter a valid name')
            return
        }
        setErrorMessage('')

        navigate({
            pathname: "/game",
            search: `?playerOne=${playerNames.playerOne}&playerTwo=${playerNames.playerTwo}`
        })
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL as string}/v1/matches`)
        .then((res) => {
            setMatchHistory(res.data as MatchInterface[])
        })
        .catch((error) => {
            console.error(error)
        })
    } ,[])
    

    return (
        <PageContainer className='flex flex-col items-center'>
            <section className='w-full flex flex-col gap-8 items-center justify-center py-40'>
                <h1 className=' font-semibold text-5xl'>Tic-Tac-Toe</h1>
                <Button className='font-medium py-4' onClick={handleModal}>
                    Start New Game
                </Button>
            </section>
            {matchHistory && (
            <section className='w-full xl:w-2/3'>
                <h3 className='px-2 pb-2 font-semibold text-lg'>Match History</h3>
                <div className='w-full'>
                    <div className={`py-2 rounded-t flex w-full items-center px-2 bg-gray-700`}>
                        <p className='flex-1'>Players</p>
                        <p className='flex-1 text-center'>Winner</p>
                        <p className='flex-1 text-center'>Score</p>
                        <p className='flex-1 text-center'>Draw</p>
                        <p className='flex-1 text-right'>Date & Time</p>
                    </div>
                    <div className='max-h-[30vh] overflow-auto'>
                        {matchHistory.map((match, index) => {
                            return(
                                <div className={`py-2 last:rounded-b flex w-full items-center px-2 ${index % 2 ? 'bg-gray-700' : ''}`}>
                                    <div className='flex flex-col flex-1 overflow-hidden'>
                                        <p className='text-ellipsis overflow-hidden'>
                                            {match.playerOne.name}
                                        </p>
                                        <p className='text-ellipsis overflow-hidden'>
                                            {match.playerTwo.name}
                                        </p>
                                    </div>
                                    
                                    <p className='flex-1 text-center text-ellipsis overflow-hidden'>
                                        {match.playerOne.score === match.playerTwo.score 
                                        ? 'Draw'
                                        : match.playerOne.score > match.playerTwo.score
                                        ? match.playerOne.name 
                                        : match.playerTwo.name}
                                    </p>
                                    <p className='flex-1 text-center'>
                                        {match.playerOne.score} - {match.playerTwo.score}
                                    </p>
                                    <p className='flex-1 text-center'>
                                        {match.draw}
                                    </p>
                                    <p className='flex-1 text-right'>
                                        {moment(match.createdAt).format("MMM DD YYYY, h:mm A")}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            )}
            <Modal isOpen={isModalOpen} closeModal={handleModal}>
                <form onSubmit={handleSubmit}>
                    <p className='pb-2 px-2 text-lg font-semibold'>Enter a name for each player</p>
                    <div className='flex flex-col gap-2'>
                        <input maxLength={8} value={playerNames.playerOne} onChange={(e) => setPlayerNames({...playerNames, playerOne: e.target.value})} placeholder="Player 1" className='bg-gray-900 border w-full px-2 py-3 border-gray-700 text-white rounded-lg'/>
                        <input maxLength={8} value={playerNames.playerTwo} onChange={(e) => setPlayerNames({...playerNames, playerTwo: e.target.value})} placeholder="Player 2" className='bg-gray-900 border w-full px-2 py-3 border-gray-700 text-white rounded-lg'/>
                    </div>
                    {errorMessage && (
                        <p className='text-red-400 text-sm italic pt-1'>{errorMessage}</p>
                    )}
                    <Button className='mt-2' type='submit'>
                        Enter
                    </Button>
                </form>
            </Modal>
        </PageContainer>
    )
}

export default Root