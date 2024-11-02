

export function sendResponse(
  success: boolean,
  message: string,
  statusCode: number = success ? 200 : 400, // Default status code
  data?: object,
) {
  return new Response(
    JSON.stringify({ success, message, data }),
    {
      status: statusCode
    }
  );
}
