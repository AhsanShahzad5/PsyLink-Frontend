import { Disability, Gender } from "@/lib/types";

  
interface SelectFieldProps {
    label: string;
    value: string | Gender | Disability;
    options: typeof Gender | typeof Disability | string[];
    onChange: (value: string) => void;
    required?: boolean;
  }
  
  export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange, required = false, }) => {
    return (
      <div className='flex flex-col items-start'>
         <label className="block text-lg md:text-xl font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
        <select 
          aria-label={label}
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
        >
          <option value="">Select {label}</option>
          {Object.values(options).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  