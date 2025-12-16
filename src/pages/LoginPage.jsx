import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function LoginPage() {

    const { register, handleSubmit, formState: { errors, isSubmitting  } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            toast.success('¡Bienvenido entrenador!');
            navigate('/pokedex');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Credenciales inválidas');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Iniciar Sesión</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input 
                            {...register('email', { 
                                required: 'El email es obligatorio',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                }
                            })} 
                            type="email" 
                            placeholder="ash@gmail.com" 
                            className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-red-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ">{errors.email.message}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input 
                            {...register('password', { 
                                required: 'La contraseña es obligatoria' 
                            })} 
                            type="password" 
                            placeholder="******" 
                            className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-red-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 rounded font-bold transition duration-200 shadow-md flex justify-center items-center border border-transparent
                            ${isSubmitting 
                                ? 'bg-white border-red-600 cursor-not-allowed' 
                                : 'bg-red-600 text-white hover:bg-red-700'     
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                            <Spinner className="h-5 w-5" />
                            <span className="ml-2 text-red-600">Entrando...</span>
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿No tienes cuenta? <Link to="/register" className="text-blue-500 font-bold hover:underline">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}