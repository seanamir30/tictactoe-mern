import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import { ReactComponent as XIcon} from '../assets/x-icon.svg'
import { ReactComponent as OIcon} from '../assets/o-icon.svg'
import Modal from '../components/Modal'
import Button from '../components/Button'
import axios from 'axios'
import { IMatch } from 'server/models/match.model'


const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const Game = () => {
    const [currentTurn, setCurrentTurn] = useState<'X'|'O'>('X')
    const [currentPlayer, setCurrentPlayer] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [isDraw, setDraw] = useState(false)
    const [playerNames] = useSearchParams()
    const navigate = useNavigate()
    const [board, setBoard] = useState<('X'|'O'|'')[]>(['', '', '', '', '', '', '', '', ''])
    const playerOne = playerNames.get('playerOne') as string
    const playerTwo = playerNames.get('playerTwo') as string
    const [playersData, setPlayersData] = useState({
        playerOne: {
            name: playerOne,
            score: 0,
        },
        playerTwo: {
            name: playerTwo,
            score: 0,
        },
        draw: 0
    })


    useEffect(() => {
        
        if(!playerOne || !playerTwo) {
            navigate('/')
            return
        }

        const firstPlayer = Math.floor(Math.random() * 2) + 1 === 1 ? playerOne : playerTwo
        setCurrentPlayer(firstPlayer)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    } ,[])

    const isGameOver = useMemo(() => {
        for(let i = 0; i < winningCombinations.length; i++) {
            const combination = winningCombinations[i]
            if(board[combination[0]] && board[combination[0]] === board[combination[1]] && board[combination[0]] === board[combination[2]]){
                return true
            }
        }

        if (board.join('').split('').length === 9) {
            setDraw(true)
            return true
        }

        return false
    }, [board])

    useEffect(() => {
        if(isDraw) {
            setPlayersData({
                ...playersData,
                draw: playersData.draw + 1 
            })
        } else if(isGameOver && !isDraw) {
            if(playersData.playerOne.name === currentPlayer) {
                setPlayersData({
                    ...playersData,
                    playerOne: {
                        ...playersData.playerOne,
                        score: playersData.playerOne.score + 1
                    }
                })
            } else if(playersData.playerTwo.name === currentPlayer) {
                setPlayersData({
                    ...playersData,
                    playerTwo: {
                        ...playersData.playerTwo,
                        score: playersData.playerTwo.score + 1
                    }
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isGameOver])

    useEffect(() => {
        if(board.join('')){
            setCurrentTurn(currentTurn === 'X' ? 'O' : 'X')
            setCurrentPlayer(playerOne === currentPlayer ? playerTwo : playerOne)
        }

        // if(board.join('').split('').length === 9)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board])

    const getBoardMarking = (mark: 'X'|'O'|'') => {
        if(mark === 'X') return <XIcon className='fill-white p-5'/>
        if(mark === 'O') return <OIcon  className='fill-white p-4'/>

        if(mark === '' && currentTurn === 'X') return <XIcon className='fill-white p-5 opacity-0 hover:opacity-10' />
        return <OIcon className='fill-white p-4 opacity-0 hover:opacity-10' />
    }

    const markBoard = (mark:'X'|'O', targetIndex: number) => {
        const updatedBoard = board.map((cell, index) => {
            if(index === targetIndex) {
                return mark
            }
            return cell
        })
        setBoard(updatedBoard)
    }

    const getWinner = () => {
        return playerOne === currentPlayer ? playerTwo : playerOne
    }

    const handleContinue = () => {
        setDraw(false)
        setBoard(['', '', '', '', '', '', '', '', ''])
    }

    const handleStop = () => {
        setLoading(true)
        axios.post(`${import.meta.env.VITE_API_URL as string}/v1/matches`, playersData satisfies IMatch)
        .then(() => {
            navigate('/')
            setLoading(false)
        })
        .catch((error) => {
            console.error(error)
        })
        return
    }

    return (
        <PageContainer className='pt-40 flex flex-col items-center'>
            <h1 className=' font-semibold text-5xl text-center mb-4'>Tic-Tac-Toe</h1>
            <p className='mb-2'>
                {isDraw ?
                    <span className='font-semibold'>Draw</span>
                :  isGameOver ?
                    <><span className='font-semibold'>{getWinner()}</span> won!</>
                :   <><span className='font-semibold'>{currentPlayer}</span>'s turn</>
                }
            </p>
            <div className='h-[90vw] w-[90vw] sm:h-[70vw] sm:w-[70vw] xl:h-[20vw] xl:w-[20vw] grid grid-cols-3 grid-rows-3'>
                {board.map((cell, index) => {
                    return(
                        <button key={`${cell}-${index}`} onClick={() => (!cell || isGameOver)&& markBoard(currentTurn, index)} className={`flex items-center justify-center ${index % 2 ? 'bg-gray-900' : 'bg-gray-800'} ${(cell || isGameOver) ? 'pointer-events-none' : ''}`}>
                            {getBoardMarking(cell)}
                        </button>
                    )
                })}
            </div>
            <div className='flex flex-col w-full sm:w-1/2 xl:w-1/4 my-4'>
                    <div className='flex justify-between px-2 py-1 bg-gray-800'>
                        <p>{playerOne}</p>
                        <p>{playersData.playerOne.score}</p>
                    </div>
                    <div className='flex justify-between px-2 py-1'>
                        <p>{playerTwo}</p>
                        <p>{playersData.playerTwo.score}</p>
                    </div>
                    <div className='flex justify-between px-2 py-1 bg-gray-800'>
                        <p>Draw</p>
                        <p>{playersData.draw}</p>
                    </div>
                </div>
            <Modal className='flex flex-col items-center justify-center' isOpen={isGameOver}>
                <h2 className='text-2xl font-bold'>{isDraw ? 'Draw' : getWinner()}</h2>
                {!isDraw && <p>won!</p>}
                <div className='flex flex-col w-full max-w-xs my-4'>
                    <div className='flex justify-between px-2 py-1 bg-gray-700'>
                        <p>{playerOne}</p>
                        <p>{playersData.playerOne.score}</p>
                    </div>
                    <div className='flex justify-between px-2 py-1 bg-gray-600'>
                        <p>{playerTwo}</p>
                        <p>{playersData.playerTwo.score}</p>
                    </div>
                    <div className='flex justify-between px-2 py-1 bg-gray-700'>
                        <p>Draw</p>
                        <p>{playersData.draw}</p>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <Button onClick={handleContinue}>
                        Continue
                    </Button>
                    <Button transparent disabled={isLoading} onClick={handleStop}>
                        Stop
                    </Button>
                </div>
            </Modal>
        </PageContainer>
    )
}

export default Game