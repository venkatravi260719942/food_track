const errors = {
    400: {
      message: "Bad Request",
      description:
        "The server could not understand the request due to invalid syntax.",
    },
    404: {
      message: "Not Found",
      description: "The requested resource could not be found on the server.",
    },
    500: {
      message: "Internal Server Error",
      description: "An unexpected error occurred on the server.",
    },
  };
   
  export default errors;