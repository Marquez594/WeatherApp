import styles from "./CSS/top.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
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
      }&include=current`;
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

  return (
    <div className={styles.Tophalf}>
      <div className={styles.navBar}>
        <div
          className={styles.currentLocation}
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
          <h1>{area}</h1>
        </div>
        <input
          type="text"
          className={styles.search}
          placeholder="Search"
        ></input>
        <div className={styles.map}>
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
          <div className={styles.weatherIcon}></div>
          <div className={styles.currentInfo}></div>
        </div>
        <div className={styles.right}></div>
      </div>
    </div>
  );
}
