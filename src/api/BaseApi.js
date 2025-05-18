export class BaseApiController {
    static async wrapResponse(apiFunction, ...args) {
        try {
            const data = await apiFunction(...args);
            if (!data) {
                const errorMessage = `Resource not found, see args: ${args}`;
                console.error(errorMessage);
                return { success: false, data };
            }

            return { success: true, data };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message: error?.message || 'Something went wrong',
                status: error?.status || 500,
                payload: error?.payload || null,
                type: error?.name || "UnexpectedError",
            };
        }
    }
}