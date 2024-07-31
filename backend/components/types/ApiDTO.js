class ApiDTO {
    data;
    success;
    code;
    message;

    static success(data) {
        const apiDTO = new ApiDTO();
        apiDTO.success = true;
        apiDTO.code = 0;
        apiDTO.message = 'OK';
        apiDTO.data = data;

        return apiDTO;
    }

    static error(code, message) {
        const apiDTO = new ApiDTO();
        apiDTO.success = false;
        apiDTO.code = code;
        apiDTO.message = message;
        apiDTO.data = null;

        return apiDTO;
    }
}


module.exports = ApiDTO;