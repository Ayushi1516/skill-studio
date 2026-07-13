import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Learning =() => {
 
    return (
        <>
        {/* <InputForm /> 
        <CounterFun /> */}
        <Uncontrolled />
        </>
    )
}

const InputForm = () => {
 const [items, setItems] = useState<any[]>([]);
 const [inputValue, setInputValue] = useState('');

 const handleSubmit = (e: any) => {
    e.preventDefault();
    const newItem: any = {
      id: Date.now().toString(), // Simple unique ID generation
      name: inputValue,
      status: false,
    };
    setItems((prev) => {return prev ? [...prev, newItem] : [newItem]});
 }
 return (
 <div className="p-4 bg-amber-50 text-center flex justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input className="flex-grow w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200" placeholder="Enter your todo name" value={inputValue} onChange={(e)=> setInputValue(e.target.value)}/>
            <button type="submit" className="px-2 py-1 bg-blue-600 border-blue-600 text-white">Add To Do</button>
        </form>
        <div className="p-4">
            {items.map(item => <li key={item.id}>{item.name}</li>)}
        </div>
    </div>)
}

const CounterFun = () => {
    const [counter, setCounter] = useState(0);

    return(<>
    <h3>Counter</h3>
    <button className="mx-4" onClick={() => setCounter(prev => prev + 1)}>Increment</button>
    <span>{counter}</span>
    <button className="mx-4" onClick={() => setCounter(prev => prev - 1)}>Decrement</button>
    </>)
}

const APIdata =() => {
    const [listData, setListData] = useState<any[]>([]);
    const [isLoading, setLoadingData] = useState(false);

    //through async/await API call
    useEffect(() => {
        const fetchData = async() => {
            const data = await fetch('./api/data');
            const responseData = await data.json();
            setListData(responseData);
        }
        fetchData();
    }, []);

    //call API through axios
    useEffect(() => {
        setLoadingData(true);
        axios.get('/api/data').then(res => {console.log(res)}).catch(err => console.log(err)).finally(()=> setLoadingData(false))
    })
}

const Uncontrolled = () => {

    const inputRef = useRef(null);
    return (<div>
        <input className="bg-white text-black" defaultValue='' ref={inputRef} type="text"/>
        {/* <p> {inputRef.current.value}</p> */}
    </div>)
}

export default Learning;