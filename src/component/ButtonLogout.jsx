export const ButtonLoout = () =>  {


    return    <>
      {/* --- Logout button --- */}
              <button
                className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sign out
            </button>
    </>
}