import React from "react";
import TrainCard from "../TrainCard";
import styles from "./page.module.scss";

const TripsContainer = async () => {
  const roskildeId = "6555"; // Id for Roskilde St.
  const borupId = "5426"; // Id for Borup St.
  const roskilde = "Roskilde St."; // Name for Roskilde St.
  const borup = "Borup St."; // Name for Borup St.
  let trip1 = null;
  let trip2 = null;
  let trip3 = null;

  let originId = borupId;
  let destId = roskildeId;

  const res = await fetch(
    `https://rejseplanen.dk/bin/rest.exe/trip?originId=${originId}&destId=${destId}&useBus=0&format=json`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (data.TripList.Trip[0].Leg) {
    trip1 = Array.isArray(data.TripList.Trip[0].Leg)
      ? data.TripList.Trip[0].Leg[0]
      : data.TripList.Trip[0].Leg;
  }

  if (data.TripList.Trip[1].Leg) {
    trip2 = Array.isArray(data.TripList.Trip[1].Leg)
      ? data.TripList.Trip[1].Leg[0]
      : data.TripList.Trip[1].Leg;
  }

  if (data.TripList.Trip[2].Leg) {
    trip3 = Array.isArray(data.TripList.Trip[2].Leg)
      ? data.TripList.Trip[2].Leg[0]
      : data.TripList.Trip[2].Leg;
  }

  //console.log(data.TripList.Trip[0].Leg.Origin.name);

  return (
    <div className={styles.tripContainer}>
      {trip1 && (
        <TrainCard
          startLoc={trip1.Origin.name}
          endLoc={trip1.Destination.name}
          startTime={trip1.Origin.time}
          endTime={trip1.Destination.time}
          startTrack={trip1.Origin.rtTrack}
          endTrack={trip1.Destination.rtTrack}
        />
      )}
      {trip2 && (
        <TrainCard
          startLoc={trip2.Origin.name}
          endLoc={trip2.Destination.name}
          startTime={trip2.Origin.time}
          endTime={trip2.Destination.time}
          startTrack={trip2.Origin.rtTrack}
          endTrack={trip2.Destination.rtTrack}
        />
      )}
      {trip3 && (
        <TrainCard
          startLoc={trip3.Origin.name}
          endLoc={trip3.Destination.name}
          startTime={trip3.Origin.time}
          endTime={trip3.Destination.time}
          startTrack={trip3.Origin.rtTrack}
          endTrack={trip3.Destination.rtTrack}
        />
      )}
      {!trip1 && !trip2 && !trip3 && <p>No trips available</p>}
    </div>
  );
};

export default TripsContainer;
