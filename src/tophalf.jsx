import styles from "./CSS/top.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Base from "./img/base.png";
export default function Tophalf() {
  const [locationIcon, setLocationIcon] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: null, log: null });
  const [userData, setUserData] = useState({});
  const [area, setArea] = useState("");

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
      }&include=current,days`;
      const respone = await fetch(url);
      const data = await respone.json();
      console.log(data);
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

  const formatdate = (olddate) =>{
    const newdate = olddate.split("-");
    return `${newdate[1]}-${newdate[2]}-${newdate[0]}`
  }
  return (
    <div
      className={styles.Tophalf}
      style={{
        background: `url(${Base}),linear-gradient(to bottom,navy,aqua)`,
        backgroundSize: "cover,cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.navBar}>
        <div className={styles.currentLocation}>
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
        ></input>
        <div className={styles.map}>
          <h1 className={styles.date} style={{color:"white"}}>
            {userData.days && userData.days[0]? formatdate(userData.days[0].datetime) :"Loading"}
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
            <div className={styles.chanceRainWind}></div>
            <img
              src="https://www.clipartqueen.com/image-files/happy-baby-sun.png"
              style={{ width: "50%" }}
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
        <div className={styles.right}></div>
      </div>
    </div>
  );
}
