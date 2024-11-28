
const DoctorStatsBar = () => {
    return (
        <div className='bg-white rounded-lg p-5 my-2'>
            <h1 className=" text-[2.5rem] ml-10">Your Stats</h1>
            <div className="flex flex-wrap justify-center gap-8 mt-16">
                {/* Patients Treated */}
                <div className="flex items-center justify-center text-white rounded-[0.6rem] w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
                    <div className="flex items-center gap-2">
                        <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">234</p>
                        <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">Patients Treated</p>
                    </div>
                </div>

                {/* Five Star Reviews */}
                <div className="flex items-center justify-center text-white rounded-[0.6rem] w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
                    <div className="flex items-center gap-2">
                        <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">70</p>
                        <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">Five Star Reviews</p>
                    </div>
                </div>
            </div>




        </div>
    )
}

export default DoctorStatsBar