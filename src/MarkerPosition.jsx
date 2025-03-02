import icon from "./icon"
import { useEffect, useMemo } from "react";
import {Marker, Popup, useMap} from "react-leaflet"

export default function MarkerPosition({ipData}){
  const position = useMemo(() => {
    return [ipData.latitude, ipData.longitude]
  }, [ipData.latitude, ipData.longitude])
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    })
  }, [map, position])

  return (
    <Marker icon={icon} position={position}>
    <Popup>
      A pretty CSS3 popup. <br/>
        Easily customizable.
    </Popup>
  </Marker>
  )
}