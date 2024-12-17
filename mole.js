import { add, tags, states, sleep } from "./nanojs"

const { div, h1, button } = tags()

const gamestate = states()
const { score, timer, moles, running, lastwacked } = gamestate(0, 10, new Array(9).fill(false), false, -1)

const mole = (i) => div(
    {   class: 'mole',
        onclick: () => {
            if (running.value && lastwacked.value !== i && moles.value[i]) score.value++
            lastwacked.value = i
        }
    },
    () => moles.value[i] ? `🐹` : `_`)

const randomMole = () => {
    const i = Math.floor(Math.random() * moles.value.length)
    return moles.value[i] ? randomMole() : i
}

const play = async (evt) => {
    const btn = evt.currentTarget
    if (running.value) return
    btn.disabled = running.value = true
    while (timer.value > 0) {
        const theMole = randomMole()
        moles.value = moles.value.map(_ => false)
        await sleep(200)
        moles.value = moles.value.map((_, i) => i === theMole)
        await sleep(800)
        --timer.value
    }
    alert(`Game over! Score: ${score.value}`)
    gamestate.reset()
    btn.disabled = false
}

const game = () => div(
    h1('Whack-A-Mole'),
    div(() => `Time: ${timer.value}s`),
    div(() => `Score: ${score.value}`),
    div({class: 'grid'}, moles.value.map((_, i) => mole(i))),
    button({onclick: play}, 'Start')
)

add(document.body, game())