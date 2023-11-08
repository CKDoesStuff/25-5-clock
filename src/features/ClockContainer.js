import React, { useState } from 'react'
import { Timer } from './Timer';

function IncrementElement(props) {
  return(
    <div className='incrementer'>
      <h3 id={`${props.id}-label`}>{props.label}</h3>
      <button id={`${props.id}-decrement`} onClick={() => {props.callback('decrement', props.value)}}>-</button>
      <span id={`${props.id}-length`} >{props.value}</span>
      <button id={`${props.id}-increment`} onClick={() => {props.callback('increment', props.value)}}>+</button>
    </div>
  );
}

function incrementerCallback(type, currentVal, setVal = null) {
  setVal(
    type === 'increment' && currentVal + 1 <= 60
      ? currentVal + 1
      : type === 'decrement' && currentVal - 1 >= 1
        ? currentVal - 1
        : currentVal
  );
}

function ClockContainer() {

  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [status, setStatus] = useState('session');
  const [isPaused, setPaused] = useState(true);

  function handleReset() {
    setBreakLength(5);
    setSessionLength(25);
    setStatus('session');
    setPaused(true);
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
  }

  function statusCallback(status) {
    let newStatus = status === 'session' ? 'break' : 'session';
    setStatus(newStatus);
    return newStatus;
  }

  function handlePaused() {
    setPaused(!isPaused)
  }

  return (
    <div className='app-container'>
      <div className='incrementer-container'>
        <IncrementElement id='session' value={sessionLength} callback={type => {incrementerCallback(type, sessionLength, setSessionLength)}} label='Session Length'/>
        <IncrementElement id='break' value={breakLength} callback={type => {incrementerCallback(type, breakLength, setBreakLength)}} label='Break Length'/>
      </div>
      <div>
        <Timer session={sessionLength} break={breakLength} status={status} statusCallback={statusCallback} resetCallback={handleReset} paused={isPaused} pauseCallback={handlePaused} />
      </div>
    </div>
  )
}

export default ClockContainer