

export default function CategorySelect(props) {
  // array of category objects (we know these ahead of time)
  // each object has an id and a label
  const categories ={
    options: [
      { id: 9, label: "General Knowledge" },
      { id: 10, label: "Entertainment: Books" },
      { id: 11, label: "Entertainment: Film" },
      { id: 12, label: "Entertainment: Music" },
      { id: 13, label: "Entertainment: Musicals & Theatres" },
      { id: 15, label: "Entertainment: Video Games" },
      { id: 16, label: "Entertainment: Board Games" },
      { id: 17, label: "Science & Nature" },
      { id: 18, label: "Science: Computers" },
      { id: 20, label: "Science: Gadgets" }
    ]
  }

  // Handler for when selection changes
 
const handleChange = (event) =>{
    props.setCategory((prevState) => ({
        ...prevState,
        category: event.target.value
    }))

    console.log('Selected value:', event.target.value);
  };

  return (
    <div>
      <label>Category:</label>
      <select 
        value={props.category.category || ""} 
        onChange={handleChange}
        className="form-select"
      >
        <option value="" disabled>Select an option:</option>
        {categories.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <p>Selected value: {props.category.category ? 
          categories.options.find(option => option.id.toString() === props.category.category.toString())?.label 
          : "None"}</p>
    </div> 
   
  );
}

