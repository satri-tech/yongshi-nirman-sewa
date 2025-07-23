interface HeaderProps {
    header: string;
    className?: string;
}

export default function Header({ header }: HeaderProps) {
    return (
        <div className="w-full flex flex-col">
            <div
                className={
                    "w-max     cursor-pointer  text-3xl font-semibold"
                }
            >
                {header}
            </div>
        </div>
    );
}
