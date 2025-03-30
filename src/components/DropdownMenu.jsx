export default function DropdownMenu({
    name,
    id,
    onChange,
    options,
    placeholder,
    className,
    value = "" // Получаем текущее значение извне
  }) {
    return (
      <select 
        className={className}
        name={name}
        id={id}
        onChange={onChange}
        value={value || ""} // Только value (удаляем defaultValue)
      >
        <option value="" hidden>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }