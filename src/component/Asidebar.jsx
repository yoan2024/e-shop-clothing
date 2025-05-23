const Asidebar = () => {
  return (
    <div className=" p-2 flex flex-col gap-6  w-1/6 bg-slate-100 rounded-xl  shadow-2xl">
      <div>
        <div className="text-xl font-semibold">Gender / Target audience</div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="men" className="text-xl font-light">
            Men
          </label>
          <input type="checkbox" id="men" />
        </div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="woman" className="text-xl font-light">
            Woman
          </label>
          <input type="checkbox" id="woman" />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Jewery</div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="jewery" className="text-xl font-light">
            Jewery
          </label>
          <input type="checkbox" id="jewery" />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Electronics</div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="electronics" className="text-xl font-light">
            Electronics
          </label>
          <input type="checkbox" id="electronics" />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Price Range Slider</div>
        <div>
          <label htmlFor="under50" className="text-xl  font-light">
            Under $50
          </label>
          <input type="radio" id="under50" className="ml-1" />
          <label htmlFor="50-200" className="text-xl font-light">
            $50-$200
          </label>
          <input type="radio" id="50-200" className="ml-1" />
          <label htmlFor="200-500" className="text-xl font-light">
            $200-$500
          </label>
          <input type="radio" id="200-500" className="ml-1" />
          <label htmlFor="500+" className="text-xl font-light">
            500+
          </label>
          <input type="radio" id="500+" className="ml-1" />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Rating Filter</div>
        <div>
          <div>
            <label htmlFor="4.5+" className="text-xl  font-light">
              ⭐ 4.5+
            </label>
            <input type="radio" id="4.5+" className="ml-1" />
          </div>
          <div>
            <label htmlFor="4+" className="text-xl font-light">
              ⭐ 4+
            </label>
            <input type="radio" id="4+" className="ml-1" />
          </div>
          <div>
            <label htmlFor="3+" className="text-xl font-light">
              ⭐ 3+
            </label>
            <input type="radio" id="3+" className="ml-1" />
          </div>
          <div>
            <label htmlFor="all" className="text-xl font-light">
              All ratings
            </label>
            <input type="radio" id="all" className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asidebar;
