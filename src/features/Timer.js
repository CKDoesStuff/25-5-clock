import React, { useEffect, useMemo, useRef, useState } from 'react'

export function Timer(props) {
  
  const timeValues =  useMemo(() => ({ session: props.session * 60, break: props.break * 60}), [props.session, props.break]);
  const timeRef = useRef({session: props.session, break: props.break}) // Hold a reference so we know when the user has changed the timer values
  const setStatus = props.statusCallback;
  const setPaused = props.pauseCallback; // Pass callbacks to variables for use as dependencies in the useEffect call
  const [time, setTime] = useState(timeValues.session);
  let minutes = Math.floor(time / 60);
  let seconds = time - (minutes * 60);

  function handleReset() {
    props.resetCallback();
    setTime(25 * 60);
  }

  useEffect(() => {
    if (timeValues.session !== timeRef.current.session || timeValues.break !== timeRef.current.break) {
      if (timeValues[props.status] !== timeRef.current[props.status]) {
        if (!props.paused) setPaused(); // Stop the timer if its value is changed while unpaused
        setTime(timeValues[props.status]);
      }
      timeRef.current = {...timeRef.current, ...timeValues}; // OW the ref value with new state value
    }

    if (!props.paused) {
      let interval = setInterval(() => {
        if (time - 1 >= 0) {
          setTime(time - 1);
        } else {
          document.getElementById('beep').play(); // Go off queen
          setTimeout(setTime(timeValues[setStatus(props.status)]), 1000);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    
  },[time, timeValues, props.paused, setPaused, props.status, setStatus])

  return(
    <div className='timer'>
      <audio id='beep' src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'></audio>
      <h3 id='timer-label'>{props.status.split('').map((letter, i) => i === 0 ? letter.toUpperCase() : letter)}</h3>
      <div className='timer-controls'>
        <div id='time-left'>
          {`${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`} {/* Ugly stuff is to make sure timer stays in MM:SS format */}
        </div>
        <div className='timer-buttons'>
          <button id='reset' onClick={handleReset}>Reset</button>
          <button id='start_stop' onClick={setPaused}>Pause/Play</button>
        </div>
      </div>
    </div>
  );
}