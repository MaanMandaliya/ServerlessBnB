import boto3


def add_to_user_pool(email, password):
    client = boto3.client('cognito-idp', region_name='us-east-1')

    response = client.sign_up(
        ClientId="27aib7mp5e27k77j3eti349pv",
        Username=email,
        Password=password
    )
    print("UserSub", response['UserSub'])
    return response['UserSub']
