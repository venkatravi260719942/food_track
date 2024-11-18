import { useEffect, useState } from "react";
import "../../../src/styles/manager/FloorLayoutAddTable.css";
import { tableImages } from "../../config/constant";

function TableCardList({ tables, setselectedTable }) {
  const [clickedTables, setClickedTables] = useState({}); // State to track clicked tables

  useEffect(() => {
    setClickedTables({});
  }, [tables]);

  const handleImageClick = (table, event) => {
    event.stopPropagation(); // Prevent click from propagating to the container
    setClickedTables((prev) => {
      const isSelected = !!prev[table.tableId]; // Check if the table is already selected
      // Toggle the clicked state for the table
      const updatedClickedTables = {
        [table.tableId]: !isSelected,
      };
      return updatedClickedTables;
    });

    // Set selectedTable to null if clicked again, otherwise set the selected table
    setselectedTable((prevSelected) =>
      prevSelected?.tableId === table.tableId ? null : table
    );
  };

  const handleOutsideClick = () => {
    // Set selected table to null if clicked outside
    setselectedTable(null);
    setClickedTables({});
  };

  return (
    <div
      className="table-card-container"
      style={{
        display: "flex",
        flexWrap: "wrap", // Allow wrapping
        justifyContent: "space-around", // Optional: distribute tables evenly
        gap: "50px", // Space between tables
      }}
    >
      {tables.map((table) => (
        <div
          key={table.tableId}
          className="table-image-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            flexBasis: "calc(20% - 20px)", // Ensure 5 tables per row with some gap
            margin: "10px", // Add margin for spacing
          }}
          onClick={handleOutsideClick} // Handle click on the container
        >
          <img
            style={{ width: 120, height: 120 }}
            src={tableImages[table.numberOfChairs]}
            alt={`${table.numberOfChairs} Seats`}
            className={`svg-image ${
              clickedTables[table.tableId] ? "clicked" : ""
            }`} // Add 'clicked' class if clicked
            onClick={(event) => handleImageClick(table, event)} // Handle click event on the image
          />
          <p className="table-number-overlay">T-{table.tableNumber}</p>
        </div>
      ))}
    </div>
  );
}

export default TableCardList;
