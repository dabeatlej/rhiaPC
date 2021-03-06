import React, { useReducer, Fragment, useEffect, useRef } from "react"; //minus uyseState
import { bookables, sessions, days } from "../../static.json";
import { FaArrowRight } from "react-icons/fa";
import Spinner from "../UI/Spinner";
import reducer from "./reducer";

import getData from "../../utils/api";

const initialState = {
  group: "Rooms",
  bookableIndex: 0,
  hasDetails: false,
  bookables,
  isLoading: true,
  error: false,
};

export default function BookablesList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    group,
    bookableIndex,
    bookables,
    hasDetails,
    isLoading,
    error,
  } = state;

  //const [group, setGroup] = useState("Kit");
  const bookablesInGroup = bookables.filter((b) => b.group === group);

  //const [bookableIndex, setBookableIndex] = useState(0);
  const groups = [...new Set(bookables.map((b) => b.group))];

  const bookable = bookablesInGroup[bookableIndex];
  //const [hasDetails, setHasDetails] = useState(false);

  //const timerRef = useRef(null);
  const nextButtonRef = useRef();

  useEffect(() => {
    dispatch({ type: "FETCH_BOOKABLES_REQUEST" });
    getData("http://localhost:3001/bookables")
      .then((bookables) =>
        dispatch({
          type: "FETCH_BOOKABLES_SUCCESS",
          payload: bookables,
        })
      )
      .catch((error) =>
        dispatch({
          type: "FETCH_BOOKABLES_ERROR",
          payload: error,
        })
      );
  }, []);

  // useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     dispatch({ type: "NEXT_BOOKABLE" });
  //   }, 3000);
  //   return stopPresentation;
  // }, []);

  // function stopPresentation() {
  //   clearInterval(timerRef.current);
  // }

  function changeGroup(event) {
    dispatch({
      type: "SET_GROUP",
      payload: event.target.value,
    });
    // setGroup(event.target.value);
    // setBookableIndex(0);
  }

  // function nextBookable() {
  //   setBookableIndex((i) => (i + 1) % bookablesInGroup.length);
  // }
  function changeBookable(selectedIndex) {
    dispatch({
      type: "SET_BOOKABLE",
      payload: selectedIndex,
    });
    nextButtonRef.current.focus();
  }
  function nextBookable() {
    dispatch({ type: "NEXT_BOOKABLE" });
  }
  function toggleDetails() {
    dispatch({ type: "TOGGLE_HAS_DETAILS" });
  }
  if (error) {
    return <p className="loading-text">{error.message}</p>;
  }
  if (isLoading) {
    return (
      <p className="loading-text">
        <Spinner /> Loading Bookables...
      </p>
    );
  }
  return (
    <Fragment>
      <div>
        <select value={group} onChange={changeGroup}>
          {groups.map((g) => (
            <option value={g} key={g}>
              {g}
            </option>
          ))}
        </select>
        <ul className="bookables items-list-nav">
          {bookablesInGroup.map((b, i) => (
            <li key={b.id} className={i === bookableIndex ? "selected" : null}>
              <button className="btn" onClick={() => changeBookable(i)}>
                {b.title}
              </button>
            </li>
          ))}
        </ul>
        <p>
          <button
            className="btn"
            onClick={nextBookable}
            ref={nextButtonRef}
            autoFocus
          >
            <FaArrowRight />
            <span>Next</span>
          </button>
        </p>
      </div>
      {bookable && (
        <div className="bookable-details">
          <div className="item">
            <div className="item-header">
              <h2>{bookable.title}</h2>
              <span className="controls">
                <label>
                  <input
                    type="checkbox"
                    checked={hasDetails}
                    //onChange={() => setHasDetails((has) => !has)}
                    onChange={toggleDetails}
                  />
                  Show Details
                </label>
                {/* <button className="btn" onClick={stopPresentation}>
                  Stop
                </button> */}
              </span>
            </div>
            <p>{bookable.notes}</p>
            {hasDetails && (
              <div className="item-details">
                <h3>Availability</h3>
                <div className="bookable-availability">
                  <ul>
                    {bookable.days.sort().map((d) => (
                      <li key={d}>{days[d]}</li>
                    ))}
                  </ul>
                  <ul>
                    {bookable.sessions.map((s) => (
                      <li key={s}>{sessions[s]}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}
