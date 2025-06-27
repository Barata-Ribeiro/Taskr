import { State } from "@/@types/application"

export default function applicationInitialState(): State<null> {
    return { ok: false, error: null, response: null }
}
