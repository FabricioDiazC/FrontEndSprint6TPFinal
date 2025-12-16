import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const { register: registerUser } = useAuth(); 
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            await registerUser(data.username, data.email, data.password);
            toast.success(`¡Bienvenido, ${data.username}!`);
            navigate('/pokedex'); 
        } catch (error) {
            const msg = error.response?.data?.message || 'Ocurrió un error en el registro';
            toast.error(msg);
        }
    };

    
    const password = watch("password");

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
                <h2 className="text-3xl font-bold text-center text-red-600 mb-2">Crear Cuenta</h2>
                <p className="text-center text-gray-500 mb-6">Únete para armar tu equipo Pokémon</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de Entrenador</label>
                        <input 
                            {...register('username', { required: 'El nombre es obligatorio' })} 
                            type="text" 
                            placeholder="Ej: AshKetchum" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
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
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input 
                            {...register('password', { 
                                required: 'La contraseña es obligatoria',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' } 
                            })} 
                            type="password" 
                            placeholder="******" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                        <input 
                            {...register('confirmPassword', { 
                                required: 'Confirma tu contraseña',
                                validate: value => value === password || "Las contraseñas no coinciden"
                            })} 
                            type="password" 
                            placeholder="******" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
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
                                <span className="ml-2 text-red-600">Registrando...</span>
                            </>
                        ) : 'Registrarse'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    ¿Ya tenes cuenta? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}