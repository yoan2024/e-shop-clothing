// InputUser.jsx

/**
 * Component: InputUser
 *
 * Description:
 * This component displays a user field (e.g. name, email, phone) in either view or edit mode.
 * It allows switching between modes to let the user update their personal information.
 *
 * Props:
 * - disable: array of field names currently in edit mode
 * - field: the name of this specific field (e.g. "name")
 * - saving: boolean indicating if the value is currently being saved
 * - value: current value of the field
 * - setstate: function to update the local input state
 * - handlesave: function triggered to save the changes
 * - handleclick: function that enables edit mode for this field
 * - texto: label text shown next to the value
 */
import { FaPencilAlt } from "react-icons/fa";

const InputUser = ({
  disable,
  field,
  saving,
  value,
  setstate,
  handlesave,
  handleclick,
  texto,
}) => {
  return (
    <>
      {/* Edit mode: if this field is listed in "disable", allow editing */}
      {disable.includes(field) && (
        <div className="flex justify-center items-center flex-row gap-2">
          {/* Editable input with label */}
          <div>
            <label htmlFor={field}>{field}:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setstate(e.target.value)} // Update input state
              className="rounded-xl"
            />
          </div>

          {/* Show 'Saving...' or 'Save' button */}
          <div>
            {saving ? (
              <span className="font-bold">Saving...</span>
            ) : (
              <button
                className="p-1 rounded-xl bg-red-700 text-white"
                onClick={handlesave}
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {/* View mode: if this field is not in edit mode, show value and edit icon */}
      {!disable.includes(field) && (
        <div className="flex flex-row gap-2 items-center">
          {/* Field label */}
          <div>{texto}:</div>

          {/* Displayed value and edit icon */}
          <div className="flex flex-row items-center gap-2">
            <div>{value}</div>
            <div className="w-6 h-6 group" onClick={() => handleclick(field)}>
              <FaPencilAlt className="w-full h-full cursor-pointer" />
              {/* Tooltip shown on hover */}
              <div className="w-fit bottom-full text-sm text-blue-300 transition-opacity opacity-0 duration-200 group-hover:opacity-100">
                Edit
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputUser;
