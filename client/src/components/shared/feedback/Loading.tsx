import Spinner from "@/components/shared/Spinner"
import { Fragment } from "react"

export default function Loading() {
    return (
        <Fragment>
            <Spinner />{" "}
            <span aria-live="polite" className="ms-3">
                Loading...
            </span>
        </Fragment>
    )
}
