from rest_framework import serializersfrom .models import School, ClassGroup, Student, Test, Question, Answerclass SchoolSerializer(serializers.ModelSerializer):    class Meta:        model = School        fields = '__all__'class ClassGroupSerializer(serializers.ModelSerializer):    class Meta:        model = ClassGroup        fields = '__all__'class StudentSerializer(serializers.ModelSerializer):    class Meta:        model = Student        fields = '__all__'class TestSerializer(serializers.ModelSerializer):    class Meta:        model = Test        fields = '__all__'class QuestionSerializer(serializers.ModelSerializer):    class Meta:        model = Question        fields = '__all__'class AnswerSerializer(serializers.ModelSerializer):    class Meta:        model = Answer        fields = '__all__'