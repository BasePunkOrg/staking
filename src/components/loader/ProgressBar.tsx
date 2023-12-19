// import ProgressBar from 'react-animated-progress-bar';
// import ProgressBar from "@ramonak/react-progress-bar";


const ProgressBar = (props: any) => {
  const { bgcolor, completed, totalSupply } = props;

    const containerStyles = {
      height: 35,
      width: "80%",
      backgroundColor: "#e0e0de",
      opacity: 0.8,
      borderRadius: 50,
      margin: "25px auto auto auto",
      boxShadow: "0px 0px 5px 1px grey",
    };

    const fillerStyles: React.CSSProperties = {
      height: "100%",
      width: `${(completed * 100) / totalSupply}%`,
      background: "linear-gradient(to right, #6996db, #a849d0)",
      borderRadius: "inherit",
      textAlign: "right",
      display: "flex",
      boxShadow: "0px 0px 22px 1px green",
      justifyContent: "right",
    };

    const labelStyles = {
      padding: 5,
      color: "white",
      fontWeight: "bold",
    };

  return (
    <div className="flex items-center mt-[25px] gap-2">
      <span className="font-bold text-white p-[5px]">{`${((completed * 100) / totalSupply).toFixed(2)}%`}&nbsp;Staked</span>
      <div className="h-[35px] w-4/5 bg-[#e0e0de]/80 rounded-full shadow-cst">
        <div className="bg-progress rounded-full border-inherit shadow-cstgr h-full" style={fillerStyles}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
