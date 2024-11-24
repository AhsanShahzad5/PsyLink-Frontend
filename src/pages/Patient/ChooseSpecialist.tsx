import React, { useState } from 'react';

const ChooseSpecialist: React.FC = () => {
  // State to hold the selected specialist
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('');

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#D3EDEB]">
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg" style={{ width: '100%', height: 'auto', minHeight: '1025px', boxShadow: '1px 6px 16px 3px rgba(0,0,0,0.25)' }}>
        <h1 className="text-3xl md:text-3xl font-medium text-left pt-2 md:pt-4 pb-4 md:pb-4">Choose Your Preference</h1>
        <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
        <p className="text-center text-xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-14 text-[#9E00CA]">
          Please Select the following Specialist only if you have had an experience with one of the doctors.
          Else We would suggest to ‘Get Checked’.
        </p>
        <div className="flex flex-wrap justify-around items-center">
          <SpecialistCard title="Psychologist" imageSrc="/src/assets/patient/chooseSpecialists/Psychologist Card.png"  hoverImageSrc="/src/assets/patient/chooseSpecialists/Psychologist2.png" onClick={() => setSelectedSpecialist('Psychologist')} selected={selectedSpecialist === 'Psychologist'} />
          <SpecialistCard title="Get Checked?" imageSrc="/src/assets/patient/chooseSpecialists/Get Checked Card.png"   hoverImageSrc="/src/assets/patient/chooseSpecialists/getChecked2.png" onClick={() => setSelectedSpecialist('Get Checked?')} selected={selectedSpecialist === 'Get Checked?'} />
          <SpecialistCard title="Psychiatrist" imageSrc="/src/assets/patient/chooseSpecialists/Psychiatrist card.png"  hoverImageSrc="/src/assets/patient/chooseSpecialists/Psychiatrist2.png" onClick={() => setSelectedSpecialist('Psychiatrist')} selected={selectedSpecialist === 'Psychiatrist'} />
        </div>
        <div className="flex justify-center mt-20 md:mt-20">
          <button className="bg-[#02968A] text-white text-xl md:text-3xl font-bold py-2 md:py-3 px-6 md:px-12 rounded-full shadow-lg hover:bg-[#027368] hover:scale-105 transition-all duration-300" onClick={() => console.log(`Selected Specialist: ${selectedSpecialist}`)}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

interface SpecialistCardProps {
  title: string;
  imageSrc: string;
  hoverImageSrc: string;
  onClick: () => void;
  selected: boolean;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ title, imageSrc, hoverImageSrc, onClick, selected }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`bg-white rounded-3xl shadow-lg p-4 transition-all duration-300 ease-in-out will-change-transform hover:scale-105 gap-2 cursor-pointer ${selected ? 'ring-4 ring-[#02968A]' : ''} mb-4 md:mb-0`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={hover ? hoverImageSrc : imageSrc} alt={title} className="w-full h-2/3 rounded-t-md object-contain" />
      <div className="mt-2 text-sm md:text-lg font-semibold">{title}</div>
    </div>
  );
}

export default ChooseSpecialist;