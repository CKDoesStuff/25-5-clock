import React, { useEffect, useMemo, useRef, useState } from 'react'


function ResetButton(props) {
  return(
    <button id='reset' onClick={() => {props.callback()}}>Reset</button>
  )
}

export function Timer(props) {
  const timeValues =  useMemo(() => ({ session: props.session * 60, break: props.break * 60}), [props.session, props.break]);
  const timeRef = useRef({session: props.session, break: props.break})
  const setStatus = props.statusCallback;
  const setPaused = props.pauseCallback;
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
        if (!props.paused) setPaused();
        setTime(timeValues[props.status]);
      }
      timeRef.current = {...timeRef.current, ...timeValues};
    }

    if (!props.paused) {
      let interval = setInterval(() => {
        if (time - 1 >= 0) {
          setTime(time - 1);
        } else {
          document.getElementById('beep').play()
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
          {`${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
        </div>
        <div className='timer-buttons'>
          <ResetButton callback={handleReset} />
          <button id='start_stop' onClick={setPaused}>Pause/Play</button>
        </div>
      </div>
    </div>
  );
}