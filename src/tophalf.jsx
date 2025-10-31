import styles from "./CSS/top.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import DayCloudy from "./img/DayCloudy.png";
import DayClear from "./img/DayClear.png";
import Base from "./img/base.png";
import Humidity from "./img/Humidity.png";
import nightClear from "./img/nightClear.png";
import cloudyMoon from "./img/cloudyMoon.png";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import Rain from "./img/Rain.png";

export default function Tophalf() {
  const [locationIcon, setLocationIcon] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: null, log: null });
  const [userData, setUserData] = useState({});
  const [area, setArea] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({ lat, log: lon });
          fetchData(lat, lon);
          fetchArea(lat, lon);
        },
        (err) => {
          console.log("here is the error" + err);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const fetchData = async (lat, lon) => {
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${
        import.meta.env.VITE_WEATHER_KEY
      }&include=current,days,hours`;
      const respone = await fetch(url);
      const data = await respone.json();
      console.log(data);
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataSearch = async () => {
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}?unitGroup=metric&key=${
        import.meta.env.VITE_WEATHER_KEY
      }&include=current,days,hours`;
      const respone = await fetch(url);
      const data = await respone.json();
      console.log(data);
      setArea(data.resolvedAddress);
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArea = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
      const respone = await fetch(url);
      const data = await respone.json();
      console.log(data);
      const city = data.address.village || "";
      const state = data.address.state;
      setArea(`${city}, ${state}`);
    } catch (err) {
      console.log(err);
    }
  };

  const formatdate = (olddate) => {
    const newdate = olddate.split("-");
    return `${newdate[1]}-${newdate[2]}-${newdate[0]}`;
  };

  const weatherIcon = (condition, time, sunset, sunrise) => {
    if (!condition || !time || !sunset || !sunrise) return DayClear;

    let currenthour = parseInt(time.split(":")[0]);
    let newSun = parseInt(sunset.split(":")[0]);
    let upSun = parseInt(sunrise.split(":")[0]);

    if (
      condition.includes("cloudy") &&
      currenthour >= upSun &&
      currenthour <= newSun
    ) {
      return DayCloudy;
    }

    if (
      condition.includes("cloudy") &&
      (currenthour > newSun || currenthour < upSun)
    ) {
      return cloudyMoon;
    }

    if (
      condition.includes("clear") &&
      currenthour >= upSun &&
      currenthour <= newSun
    ) {
      return DayClear;
    }

    if (
      condition.includes("clear") &&
      (currenthour > newSun || currenthour < upSun)
    ) {
      return nightClear;
    }

    return DayClear;
  };

  const weatherIconNext = (condition) => {
    if (condition.includes("cloudy")) {
      return DayCloudy;
    }
    if (condition.includes("clear")) {
      return DayClear;
    }
    if (condition.includes("rain")) {
      return Rain;
    }
  };
  const formatTime = (oldtime) => {
    const timeArray = oldtime.split(":");
    let newtime = 0;
    if (timeArray[0] >= 12) {
      newtime = (timeArray[0] % 12) + " pm";
    } else {
      newtime = (timeArray[0] % 12) + " am";
      if (timeArray[0] == 0) {
        newtime = "12 am";
      }
    }

    return newtime;
  };

  const getHourlyForecast = (timepassed) => {
    const hours = [];
    const gettime = timepassed.split(":");
    const currentTime = parseInt(gettime[0]);
    const maxNum = currentTime + 7;
    for (let i = currentTime; i < maxNum; i++) {
      if (i >= 24) {
        let newI = i % 24;
        hours.push(
          <div className={styles.cells}>
            <h1>
              {userData.days && userData.days[1]
                ? formatTime(userData.days[1].hours[newI].datetime)
                : "Bruh"}
            </h1>
            <img
              src={
                userData.days && userData.days[1]
                  ? weatherIcon(
                      userData.days[1].hours[newI].icon,
                      userData.days[1].hours[newI].datetime,
                      userData.days[1].sunset,
                      userData.days[1].sunrise
                    )
                  : null
              }
              style={{ height: "40%", width: "80%" }}
            ></img>
            <h1>
              {userData.days && userData.days[1]
                ? (
                    (userData.days[1].hours[newI].temp * 9) / 5 +
                    32
                  ).toPrecision(2) + "°"
                : "burh"}
            </h1>
            <div
              style={{
                display: "Flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <FontAwesomeIcon icon={faDroplet}></FontAwesomeIcon>
              <h2>
                {userData.days && userData.days[1]
                  ? userData.days[1].hours[newI].precipprob + "%"
                  : "Loading"}
              </h2>
            </div>
          </div>
        );
      } else {
        hours.push(
          <div className={styles.cells}>
            <h1>
              {userData.days && userData.days[0]
                ? formatTime(userData.days[0].hours[i].datetime)
                : "Bruh"}
            </h1>
            <img
              src={
                userData.days && userData.days[0]
                  ? weatherIcon(
                      userData.days[0].hours[i].icon,
                      userData.days[0].hours[i].datetime,
                      userData.days[0].sunset,
                      userData.days[0].sunrise
                    )
                  : null
              }
              style={{ height: "50%", width: "50%" }}
            ></img>
            <h1>
              {userData.days && userData.days[0]
                ? ((userData.days[0].hours[i].temp * 9) / 5 + 32).toPrecision(
                    2
                  ) + "°"
                : "burh"}
            </h1>
            <div
              style={{
                display: "Flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <FontAwesomeIcon icon={faDroplet}></FontAwesomeIcon>
              <h2>
                {userData.days && userData.days[0]
                  ? userData.days[0].hours[i].precipprob + "%"
                  : "Loading"}
              </h2>
            </div>
          </div>
        );
      }
    }

    return hours;
  };

  const getNextForecast = () => {
    const days = [];
    for (let i = 1; i < 7; i++) {
      days.push(
        <div className={styles.cells} style={{ height: "90%", width: "13%" }}>
          <h1 style={{ fontSize: "25px" }}>
            {userData.days && userData.days[i]
              ? formatdate(userData.days[i].datetime)
              : "Loading"}
          </h1>
          <img
            src={
              userData.days && userData.days[i]
                ? weatherIconNext(userData.days[i].icon)
                : null
            }
            style={{ height: "50%", width: "70%" }}
          ></img>
          <h2 style={{ fontSize: "35px" }}>
            {userData.days && userData.days[i]
              ? ((userData.days[i].temp * 9) / 5 + 32).toPrecision(2) + "°"
              : "Loading"}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <h3>
              {"L: " +
                (userData.days && userData.days[i]
                  ? ((userData.days[i].tempmin * 9) / 5 + 32).toPrecision(2)
                  : "Loading")}
            </h3>
            <h3>
              {"H: " +
                (userData.days && userData.days[i]
                  ? ((userData.days[i].tempmax * 9) / 5 + 32).toPrecision(2)
                  : "Loading")}
            </h3>
          </div>
          <div
            style={{
              display: "Flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <FontAwesomeIcon icon={faDroplet}></FontAwesomeIcon>
            <h2>
              {userData.days && userData.days[i]
                ? userData.days[i].precipprob + "%"
                : "Loading"}
            </h2>
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div
      className={styles.Tophalf}
      style={{
        background: `url(${Base}) no-repeat center center`,
        backgroundSize: "cover",
        backgroundPositionY: "100%",
      }}
    >
      <div className={styles.navBar}>
        <div
          className={styles.currentLocation}
          onClick={() => {
            fetchData(userLocation.lat, userLocation.log);
            fetchArea(userLocation.lat, userLocation.log);
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onMouseEnter={() => setLocationIcon(true)}
            onMouseLeave={() => setLocationIcon(false)}
          >
            <FontAwesomeIcon
              icon={faLocationDot}
              size="2x"
              color="white"
              bounce={locationIcon}
              style={{ paddingTop: "10px" }}
            ></FontAwesomeIcon>
            <h1 style={{ color: "white" }}>{area}</h1>
          </div>
        </div>
        <input
          type="text"
          className={styles.search}
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              if (search.trim() !== "") {
                fetchDataSearch();
              }
            }
          }}
        ></input>
        <div className={styles.map}>
          <h1 className={styles.date} style={{ color: "white" }}>
            {userData.days && userData.days[0]
              ? formatdate(userData.days[0].datetime)
              : "Loading"}
          </h1>
          <button>
            <FontAwesomeIcon
              icon={faMapLocationDot}
              size="3x"
              color="white"
            ></FontAwesomeIcon>
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.weatherIcon}>
            <div className={styles.chanceRainWind}>
              <div className={styles.rainChance} title="Rain Chance">
                <FontAwesomeIcon
                  icon={faDroplet}
                  style={{ fontSize: "20px" }}
                ></FontAwesomeIcon>
                <h1 style={{ fontSize: "16px" }}>
                  {userData.currentConditions
                    ? userData.currentConditions.precipprob + "%"
                    : "Loading"}
                </h1>
              </div>
              <div className={styles.windChance} title="Wind Speed">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{
                    transform: `rotate(${
                      userData.currentConditions
                        ? (userData.currentConditions.winddir + 180) % 360
                        : null
                    }deg)`,
                  }}
                ></FontAwesomeIcon>
                <h1 style={{ fontSize: "16px" }}>
                  {userData.currentConditions &&
                  userData.currentConditions.windspeed != null
                    ? (
                        userData.currentConditions.windspeed / 1.609
                      ).toPrecision(2) + "mph"
                    : "Loading"}
                </h1>
              </div>
              <div className={styles.hum} title="Humidity">
                <img src={Humidity}></img>
                <h1 style={{ fontSize: "16px" }}>
                  {userData.currentConditions &&
                  userData.currentConditions.humidity != null
                    ? userData.currentConditions.humidity + "%"
                    : "Loading"}
                </h1>
              </div>
            </div>
            <img
              src={
                userData.currentConditions
                  ? weatherIcon(
                      userData.currentConditions.icon,
                      userData.currentConditions.datetime,
                      userData.currentConditions.sunset,
                      userData.currentConditions.sunrise
                    )
                  : null
              }
              style={{
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                height: "100%",
                scale: "0.8",
              }}
            ></img>
          </div>
          <div className={styles.currentInfo}>
            <div className={styles.temp}>
              <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>
                {userData.currentConditions
                  ? ((userData.currentConditions.temp * 9) / 5 + 32).toFixed(
                      0
                    ) + "°"
                  : "Loading..."}
              </h1>
              <div className={styles.feels}>
                <h1 style={{ fontSize: "25px" }}>
                  {userData.currentConditions &&
                  userData.currentConditions.feelslike != null
                    ? "Feels Like: " +
                      (
                        (userData.currentConditions.feelslike * 9) / 5 +
                        32
                      ).toPrecision(2) +
                      "°"
                    : "Loading"}
                </h1>
              </div>
              <div className={styles.lowHigh}>
                <h1>
                  {userData.days && userData.days[0]
                    ? "L: " +
                      ((userData.days[0].tempmin * 9) / 5 + 32).toFixed(0) +
                      "°"
                    : "Loading"}
                </h1>
                <h1>
                  {userData.days && userData.days[0]
                    ? "H: " +
                      ((userData.days[0].tempmax * 9) / 5 + 32).toFixed(0) +
                      "°"
                    : "Loading"}
                </h1>
              </div>
            </div>
            <div className={styles.otherInfo}></div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.hourlyForecast}>
            {userData.currentConditions
              ? getHourlyForecast(userData.currentConditions.datetime)
              : null}
          </div>
          <div className={styles.nextForecast}>{getNextForecast()}</div>
        </div>
      </div>
    </div>
  );
}
