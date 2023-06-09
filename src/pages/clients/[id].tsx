
import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Divider, Typography } from '@mui/material';

import { IUser } from '../../interface';
import { DashboardLayaout } from '../../components/layouts';
import { UserProfile } from '../../components/users';
import { dbUsers } from '../../database';

interface Props {
   user: IUser;
}

const ClientPage: FC<Props> = ({ user }) => {

   return (
      <DashboardLayaout title={`${user.firstName} ${user.lastName}`} pageDescription={'Información detallada del cliente'}>
         <UserProfile user={user} />
         <Divider variant='middle' />

         {/* //TODO: Crear componente para visualizar actividades asiganas */}
         <Typography variant='h1' component='h1' marginTop='30px'>Actividades Asiganadas:</Typography>

      </DashboardLayaout>
   )
}

//*Método para la creación de los paths de las distinas páginas de la App (tener en cuenta llaves en el nombre del archivo)
export const getStaticPaths: GetStaticPaths = async (ctx) => {
   const users = await dbUsers.getUsersByRole('client');
   return {
      paths: users.map(({ id }) => ({
         params: {id: String(id)}
      })),
      fallback: "blocking"
   }
}

//*Método para crear el contenido estático que va a ir a las props de la página que va a ser renderizada
export const getStaticProps: GetStaticProps = async ({ params }) => {
   const { id = '' } = params as { id: string };
   const user = await dbUsers.getUserById(id);
   if (!user) {
      return {
         redirect: {
            destination: '/',
            permanent: false
         }
      }
   }
   return {
      props: {
         user
      },
      revalidate: 86400, //*Revalida el contenido de la paǵina en este tiempo determinado
   }
}

export default ClientPage;