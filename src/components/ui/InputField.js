export const InputField = ({ label, small, ...props }) => (
  <div>
    {label && (
      <label
        className={`block mb-1 font-medium ${
          small ? "text-xs text-gray-400" : "text-gray-300"
        }`}
      >
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white ${
        small ? "p-2 text-sm" : "p-3"
      }`}
    />
  </div>
);
