const errorMessages = {
  400: {
    message: "Please check the required fields input",
    description:
      "The server could not understand the request due to invalid syntax.",
  },
  401: {
    message: "Invalid password",
    description: "The user is not authorized to access this resource.",
  },
  403: {
    message: "Forbidden User",
    description: "Access to the requested resource is forbidden.",
  },
  404: {
    message: "User Not Found",
    description: "The requested resource could not be found on the server.",
  },
  409: (errorMessage) => {
    const match = /Unique constraint failed on the fields: \((.*?)\)/.exec(
      errorMessage
    );

    if (match) {
      let fieldValue = match[1].trim();
      fieldValue = fieldValue.replace(/`/g, "");
      return {
        message: `${fieldValue} already exists`,
        description: "",
      };
    }
    // Default error message if match is not found
    return {
      message: "Conflict",
      description: "Resource already exists.",
    };
  },
  500: {
    message: "Internal Server Error",
    description: "An unexpected error occurred on the server.",
  },
};
export default errorMessages;
