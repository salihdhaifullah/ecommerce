const Line = ({height = 1, className}: {height?: number, className?: string}) => {
    return <span
    style={{minHeight: `${height}px`}}
    className={`min-w-full rounded-lg  bg-gradient-to-tr my-2 from-gray-600 to-blue-400 flex ${className}`}
     />
}

export default Line;
