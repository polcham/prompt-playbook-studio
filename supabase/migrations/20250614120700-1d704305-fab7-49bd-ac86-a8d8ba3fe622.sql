-- Allow everyone to view comments (since they're public content)
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments 
FOR SELECT 
USING (true);