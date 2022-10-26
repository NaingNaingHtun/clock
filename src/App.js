import { useEffect, useState } from "react";
import { FaPlay, FaPause, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [running, setRunning] = useState(false);
  const [currentSessionLabel, setCurrentSessionLabel] = useState("Session");
  const [timerInterval, setTimerInterval] = useState(null);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(sessionLength);

  const formatTime = (minute, second) => {
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return minute + ":" + second;
  };
  const play = () => {
    const interval = setInterval(() => {
      // //updating second
      // if (currentSecond < 0) {
      //   setCurrentSecond(59);
      //   setCurrentMinute((prevMinute) => prevMinute - 1);
      // } else {
      //   setCurrentSecond((prevSecond) => prevSecond - 1);
      // }
      setCurrentSecond((prevSecond) => {
        if (prevSecond - 1 < 0) {
          return 59;
        } else {
          return prevSecond - 1;
        }
      });
    }, 1000);

    setTimerInterval(interval);
  };

  useEffect(() => {
    if (currentSecond === 59) {
      //one minute is elapsed
      setCurrentMinute((prevMin) => prevMin - 1);
    }
  }, [currentSecond]);

  const pause = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };

  const playAlarm = () => {
    const audio = document.getElementById("beep");
    // audio.load();
    audio.play();
    // setTimeout(() => {
    //   audio.pause();
    // }, 4000);
  };

  useEffect(() => {
    if (currentMinute < 0) {
      //one session ended
      if (currentSessionLabel === "Session") {
        setCurrentMinute(breakLength);
        setCurrentSessionLabel("Break");
        setCurrentSecond(0);
        playAlarm();
      } else {
        setCurrentMinute(sessionLength);
        setCurrentSessionLabel("Session");
        setCurrentSecond(0);
        playAlarm();
      }
    }
  }, [currentMinute]);

  const decreaseSession = () => {
    if (running) return null;
    setSessionLength((prevSessionLength) => {
      if (prevSessionLength - 1 < 1) {
        return 1;
      } else {
        return prevSessionLength - 1;
      }
    });
  };

  const increaseSession = () => {
    if (running) return null;

    setSessionLength((prevSessionLength) => {
      if (prevSessionLength + 1 > 60) {
        return 60;
      } else {
        return prevSessionLength + 1;
      }
    });
  };

  const decreaseBreak = () => {
    if (running) return null;

    setBreakLength((prevBreakLength) => {
      if (prevBreakLength - 1 < 1) {
        return 1;
      } else {
        return prevBreakLength - 1;
      }
    });
  };

  const increaseBreak = () => {
    if (running) return null;

    setBreakLength((prevBreakLength) => {
      if (prevBreakLength + 1 > 60) {
        return 60;
      } else {
        return prevBreakLength + 1;
      }
    });
  };

  const reset = () => {
    setCurrentSessionLabel("Session");
    setSessionLength(25);
    setBreakLength(5);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.load();
    audio.pause();
  };

  useEffect(() => {
    if (!running) {
      if (currentSessionLabel === "Break") {
        setCurrentMinute(breakLength);
        setCurrentSecond(0);
      }
    }
  }, [breakLength]);

  useEffect(() => {
    if (!running) {
      if (currentSessionLabel === "Session") {
        setCurrentMinute(sessionLength);
        setCurrentSecond(0);
      }
    }
  }, [sessionLength]);

  useEffect(() => {
    const audio = document.getElementById("beep");
    console.log(audio.load);
  }, []);
  return (
    <div className="flex flex-col justify-center items-center w-[100vw] h-[100vh] bg-[#c2c2e1]">
      <h1 className="text-7xl">25+5 Clock</h1>
      <div className="flex gap-5 mt-5">
        <div>
          <div id="break-label" className="text-2xl">
            Break Length
          </div>
          <div className="flex justify-center gap-3 text-xl">
            <button id="break-decrement" onClick={decreaseBreak}>
              <FaArrowDown className="text-xl" />
            </button>
            <div id="break-length" className="text-xl font-bold">
              {breakLength}
            </div>
            <button id="break-increment" onClick={increaseBreak}>
              <FaArrowUp className="text-xl" />
            </button>
          </div>
        </div>
        <div>
          <div id="session-label" className="text-2xl">
            Session Length
          </div>
          <div className="flex justify-center gap-3 text-xl">
            <button id="session-decrement" onClick={decreaseSession}>
              <FaArrowDown className="text-xl" />
            </button>
            <div id="session-length" className="text-xl font-bold">
              {sessionLength}
            </div>
            <button id="session-increment" onClick={increaseSession}>
              <FaArrowUp className="text-xl" />
            </button>
          </div>
        </div>
      </div>
      <div
        style={{ color: currentMinute === 0 ? "red" : "black" }}
        className="flex flex-col gap-5 justity-center items-center mt-5 border-[0.5px] w-[300px] p-5 rounded-lg shadow-lg"
      >
        <div id="timer-label" className="text-3xl text-center">
          {currentSessionLabel}
        </div>
        <div id="time-left" className="text-5xl text-center">
          {formatTime(currentMinute, currentSecond)}
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <button id="start_stop" onClick={() => setRunning(!running)}>
          {running ? (
            <FaPause className="text-2xl" onClick={pause} />
          ) : (
            <FaPlay className="text-2xl" onClick={play} />
          )}{" "}
        </button>
        <button id="reset">
          <GrPowerReset className="text-2xl" onClick={reset} />
        </button>
      </div>
      <div className="hidden">
        <audio id="beep" controls src="/audio/alarm.wav"></audio>
      </div>
    </div>
  );
}

export default App;
