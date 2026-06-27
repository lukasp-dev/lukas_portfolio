interface AlertProps {
    type: 'danger' | 'success' | 'info' | 'warning';
    text: string;
}

const Alert: React.FC<AlertProps> = ({ type, text }) => {
    return (
        <div className="fixed bottom-5 right-5 flex justify-center items-center z-50">
            <div
                className={`${
                    type === 'danger' ? 'bg-red-800 text-indigo-100' : 'bg-black-300 text-gray-100 border border-amber-gold/30'
                } items-center leading-none lg:rounded-full flex lg:inline-flex rounded-md p-5`}
                role="alert">
                <p
                    className={`flex rounded-full ${
                        type === 'danger' ? 'bg-red-500 text-white' : 'bg-amber-gold text-black-200'
                    } uppercase px-2 py-1 text-xs font-semibold mr-3`}>
                    {type === 'danger' ? 'Failed' : 'Success'}
                </p>
                <p className="mr-2 text-left">{text}</p>
            </div>
        </div>
    );
};

export default Alert;
