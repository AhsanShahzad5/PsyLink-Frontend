

import { FaPenAlt } from "react-icons/fa";

const doctorImage = "/src/assets/shared/fahad.png";

const DoctorAboutSection = () => {
    return (
        <div className='bg-white rounded-lg p-5 my-2'>


            <AboutSection />

        </div>
    )
}

export default DoctorAboutSection


const AboutSection = () => {
    return (
        <div className="h-100">
            <div className="flex items-center justify-between mb-4">
                <div className=" w-[90vw] flex flex-col mb-[2rem]">
                    <div className="flex justify-between mt-3">

                        <h2 className="text-[2rem] font-bold  ">Your About Section</h2>
                        <FaPenAlt size={35} className="cursor-pointer text-gray-700" />
                    </div>
                    <div className="w-full h-1 bg-gray-300 mt-5"></div>
                </div>
            </div>
            <div className="flex text-gray-700">
                <div className="flex-1">
                    <p className="text-[1.2rem]">
                        Welcome! I am a dedicated psychologist based in Pakistan, specializing in mental health and well-being. With a Master's degree in Clinical Psychology from Lahore University of Management Sciences (LUMS), I am committed to helping individuals navigate their mental health challenges and achieve a balanced and fulfilling life.
                        With over 7 years of experience, I have worked with diverse populations, including children, adolescents, and adults, addressing issues such as anxiety, depression, stress, relationship difficulties, and trauma. My approach is rooted in evidence-based practices, combining Cognitive Behavioral Therapy (CBT), mindfulness techniques, and holistic methods to tailor treatment to each individual's unique needs.
                        I believe in creating a safe and supportive environment where clients can openly express their thoughts and feelings. My goal is to empower individuals to understand their emotions, develop coping strategies, and foster resilience in the face of life's challenges.

                        Welcome! I am a dedicated psychologist based in Pakistan, specializing in mental health and well-being. With a Master's degree in Clinical Psychology from Lahore University of Management Sciences (LUMS), I am committed to helping individuals navigate their mental health challenges and achieve a balanced and fulfilling life.

                        With over 7 years of experience, I have worked with diverse populations, including children, adolescents, and adults, addressing issues such as anxiety, depression, stress, relationship difficulties, and trauma. My approach is rooted in evidence-based practices, combining Cognitive Behavioral Therapy (CBT), mindfulness techniques, and holistic methods to tailor treatment to each individual's unique needs.
                        I believe in creating a safe and supportive environment where clients can openly express their thoughts and feelings. My goal is to empower individuals to understand.
                    </p>
                </div>
                <div className="w-[23vw] h-[70vh] ml-8 rounded-md overflow-hidden mt-5">
                    <img
                        src={doctorImage}
                        alt="fadi g"
                        className="w-full h-full object-cover"
                    />
                </div>

            </div>
        </div>
    );
};

