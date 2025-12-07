class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // ✅ sets the error message correctly
    this.statusCode = statusCode;
  }
}




// class ExpressError extends Error {
//     constructor(statusCode,message){
//         super();
//         this.statusCode= statusCode;
//         this.message=message;
//     }
// } 

module.exports= ExpressError;