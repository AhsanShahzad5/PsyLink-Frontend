interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }
  
  export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
    return (
      <div className='flex flex-col items-start'>
        <label className="block text-lg md:text-xl font-medium text-gray-700">{label}</label>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
        />
      </div>
    );
  }
  