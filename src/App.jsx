import { useState, useEffect} from "react"

import { MapContainer, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import MarkerPosition from "./MarkerPosition"
import arrowIcon from "./assets/images/icon-arrow.svg"
import backgroundImage from "./assets/images/pattern-bg-desktop.png"
  
 function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [ipData, setIpData] = useState(null)

  const ipAddressV4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
  const ipAddressV6 = /^(?:[0-9a-fA-F]1,4:)7[0-9a-fA-F]1,4/;

  const API_KEY = import.meta.env.VITE_IPGEO_KEY;

 
  const validateIpAddress = (ip) => {
    
    return ipAddressV4.test(ip) ? "ipv4" : ipAddressV6.test(ip) ? "ipv6" : "invalid";
    
  }
 

  
  useEffect(() => {
    const ipApiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ipAddress}`
      try{
        const fetchIpData = async() => {
          const response = await fetch(ipApiUrl);
          const data = await response.json();

          setIpData(data)
        }
        fetchIpData()
      }catch (error){
        console.trace(error)
      } 
  }, [])

  async function handleInputChange(ip){

    const validIp = validateIpAddress(ip);

    if(!validIp) return;
      

    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ip}`)  

    
    if(!response.ok){
      throw new Error ("Failed to fetch IP details")
    }
    const data = await response.json();
    setIpData(data)
   }
    
  const handleSubmit = (e) => {
    e.preventDefault();
    handleInputChange(ipAddress)
     setIpAddress("")
  }


  return (
   
    <>
      <section>
        <div className="absolute -z-10">
          <img src={backgroundImage} alt=""
          className="w-full h-80 object-cover" 
          />
        </div>
        <article className="p-8">
          <h1 className="text-2xl text-center text-white font-bold mb-8 lg:text-3xl">IP Address Tracker</h1>

          <form onSubmit={handleSubmit}  autoComplete="off" className="flex justify-center max-w-xl mx-auto relative">
            <input 
              type="text"
              name="ipaddress"
              id="ipaddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Search for any IP address or domain" required
              className="py-2 px-4 rounded-l-lg bg-amber-50 w-full"
            />
            <button type="submit" className="bg-black py-4 px-4 hover:opacity-60 rounded-r-lg">
              <img src={arrowIcon} alt="arrow icon" />
            </button>
          </form>
   
        </article>

         {ipData && (
          <>
            <article className="bg-white rounded-lg p-8 shadow text-center mx-8 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl xl:mx-auto md:text-left lg:text-left lg:-mb-16 relative" style={{zIndex: 1000}}>
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">IP Address</h2>
                <p className="text-slate-900 font-semibold text-lg md:text-xl xl:2xl">{ipData.ip}</p>
              </div>
              <div className="lg:border-r lg:border-slate-400">
                 <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">location</h2>
                 <p className="text-slate-900 font-semibold text-lg md:text-xl xl:2xl">{ipData.district}, {ipData.city}</p>
              </div>
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Timezone</h2>
                <p className="text-slate-900 font-semibold text-lg md:text-xl xl:2xl">UTC {ipData.time_zone.offset}:00 </p>
              </div>
              <div>
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">ISP</h2>
                <p className="text-slate-900 font-semibold text-lg md:text-xl xl:2xl">{ipData.isp}</p>
              </div>
            </article>

            <MapContainer 
              center={[ipData.latitude, ipData.longitude]} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{height: "700px", width: "100vw"}}
            >
              <TileLayer
                attribution='&copy; 
                <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition ipData={ipData}/>
            </MapContainer>
          </>
        )}
        
      </section>
    </>
  )
}

export default App
