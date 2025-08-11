const Background = ({children}) =>{
    return(
         <div className="min-h-screen w-full relative">
        {/* Orchid Depths */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
          }}
        />
        <div className="relative z-10 w-full h-full">
        {children}
      </div>

      </div>
    )
}
export default Background