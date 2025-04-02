const Header = ({ title }) => {
    return (
        <header className='sticky top-0 bg-green-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-green-700 z-20'>
            <div className='py-4 px-6'>
                <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
            </div>
        </header>
    );
};
export default Header;